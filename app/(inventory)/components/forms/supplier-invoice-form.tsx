"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item";
import uploadImageToS3, { deleteImageFromS3 } from "@/lib/s3";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Loading,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import ItemAddForm from "./item-add-form";
import { ITEM_QUERY, ITEMS_QUERY } from "@/graphql/item/queries";
import { ITEM_TYPE } from "@/graphql/item/types";
import { SUPPLIERS_QUERY } from "@/graphql/supplier/queries";
import { SUPPLIER_TYPE } from "@/graphql/supplier/types";
import useStore from "@/stores";
import { randomId, toFixed } from "@/lib/utils";
import {
  SUPPLIER_INVOICE_ITEM_QUERY,
  SUPPLIER_INVOICE_ITEMS_QUERY,
  SUPPLIER_INVOICE_QUERY,
  SUPPLIER_INVOICES_QUERY,
} from "@/graphql/supplier-invoice/queries";
import {
  SUPPLIER_INVOICE_ITEM_DELETE_MUTATION,
  SUPPLIER_INVOICE_ITEM_MUTATION,
  SUPPLIER_INVOICE_MUTATION,
} from "@/graphql/supplier-invoice/mutations";
import { PAYMENT_STATUSES } from "@/constants/payment.constants";
import SupplierPaymentModal from "../supplier-payment-modal";
import { ITEMS_TYPE } from "@/stores/slices";
import { SUPPLIER_INVOICE_ITEM_TYPE } from "@/graphql/supplier-invoice/types";
import Info from "@/components/Info";
import { ORDER_STATUSES } from "@/constants/order.constants";
import { useRouter } from "next/navigation";

const invoiceFormSchema = z.object({
  supplier: z.string().optional(),
  invoiceImage: z.instanceof(File).optional(),
});

type InvoiceFormSchema = z.infer<typeof invoiceFormSchema>;

export function SupplierInvoiceForm({ invoiceId }: { invoiceId?: string }) {
  const [worning, setWorning] = useState("");
  const [orderId, setOrderId] = useState<string | undefined>();
  const [isModelOpen, setIsModalOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const selectedItems = useStore((store) => store.items);
  const addItems = useStore((store) => store.addItems);
  const clearItems = useStore((store) => store.clearItems);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<InvoiceFormSchema>({
    resolver: zodResolver(invoiceFormSchema),
  });

  const { data: invoiceRes, loading: invoiceQueryLoading } = useQuery(
    SUPPLIER_INVOICE_QUERY,
    {
      variables: { id: invoiceId },
      onCompleted: (res) => {
        const supplierInvoice = res?.supplierInvoice;
        // form.setValue('amount', res?.supplierInvoice?.supplier)
        if (supplierInvoice?.supplier) {
          form.setValue("supplier", supplierInvoice?.supplier.id);
        }
        if (supplierInvoice?.invoiceImage) {
          setImagePreviewUrl(supplierInvoice?.invoiceImage);
        }
      },
      onError: () => {
        router.push("/supplier-invoices");
      },
      skip: !invoiceId,
    }
  );
  const { data: invoiceItemsRes, loading: invoiceItemsQueryLoading } = useQuery(
    SUPPLIER_INVOICE_ITEMS_QUERY,
    {
      variables: { supplierInvoice: invoiceId },
      onCompleted: (res) => {
        const newItems: ITEMS_TYPE = new Map();
        const supplierInvoiceItems = res?.purchaseInvoiceItems.edges;
        supplierInvoiceItems.forEach(
          ({ node }: { node: SUPPLIER_INVOICE_ITEM_TYPE }) => {
            newItems.set(node.item.id, {
              id: node.id,
              quantity: node.quantity,
              price: Number(toFixed(node.price)),
              vat: node.item.vat,
              name: node.item.name,
            });
          }
        );
        addItems(newItems);
      },
      skip: !invoiceId,
    }
  );

  const [getItem, { loading: itemQueryLoading }] = useLazyQuery(ITEM_QUERY);
  const [getInvoiceItem, { loading: invoiceItemQueryLoading }] = useLazyQuery(
    SUPPLIER_INVOICE_ITEM_QUERY
  );

  // Invoice Mutation
  const [invoiceMutation, { loading: create_loading }] = useMutation(
    SUPPLIER_INVOICE_MUTATION,
    {
      onCompleted(data) {
        setOrderId(data?.supplierInvoiceCud?.supplierInvoice.id);
      },
      refetchQueries: [
        {
          query: SUPPLIER_INVOICES_QUERY,
          variables: {
            offset: 0,
            first: 10,
            search: "",
          },
        },
      ],
      awaitRefetchQueries: true,
    }
  );
  // Invoice Items Mutation
  const [invoiceItemMutation, { loading: itemCreate_loading }] = useMutation(
    SUPPLIER_INVOICE_ITEM_MUTATION
  );

  // delete invoice item
  const [deleteInvoiceItem, { loading: deleteInvoiceItemMutationLoading }] =
    useMutation(SUPPLIER_INVOICE_ITEM_DELETE_MUTATION);

  //  list of registered suppliers
  const { loading: supplier_loading, data: supplierRes } = useQuery(
    SUPPLIERS_QUERY,
    {
      variables: {
        first: 100,
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );
  const suppliers: OPTION_TYPE[] =
    supplierRes?.suppliers?.edges?.map(({ node }: { node: SUPPLIER_TYPE }) => ({
      value: node.id,
      label: node.name,
    })) || [];

  // all item query
  const { data, loading } = useQuery(ITEMS_QUERY, {
    variables: { first: 100 },
  });

  const items: OPTION_TYPE[] =
    data?.items?.edges?.map(({ node }: { node: ITEM_TYPE }) => ({
      value: node.id,
      label: node.name,
      unit: node.unit?.name,
    })) || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("invoiceImage", e.target.files?.[0]);
    if (e.target.files?.[0]) {
      setImagePreviewUrl(URL.createObjectURL(e.target.files?.[0]));
    }
  };

  async function onSubmit(data: InvoiceFormSchema) {
    try {
      setWorning("");
      setOrderId(undefined);
      if (!data.invoiceImage && !data.supplier && !imagePreviewUrl) {
        form.setError("supplier", {
          message: "Select supplier or Input invoice image",
        });
        return;
      }
      if (!selectedItems.size) {
        toast({ description: "Add Minimum 1 item", variant: "destructive" });
        return;
      }
      // validation purchase items
      for (const [, value] of selectedItems) {
        if (value.quantity < 1) {
          toast({
            description: "Quantity can not be less 1",
            variant: "destructive",
          });
          return;
        }
        if (value.price < 1) {
          toast({
            description: "Price can not be less 0",
            variant: "destructive",
          });
          return;
        }
      }

      // check is it updateable or not
      if (invoiceId) {
        // check status
        if (invoiceRes?.supplierInvoice.status !== ORDER_STATUSES.PENDING) {
          setWorning(
            `The invoice is updateable. Only panding invoice can update.`
          );
          return 0;
        }

        // check stock valid or not
        for (const [itemId, value] of selectedItems) {
          if (value.id) {
            const itemRes = await getItem({ variables: { id: itemId } });
            const invoiceItemRes = await getInvoiceItem({
              variables: { id: value.id },
            });

            const preCurrentStock = itemRes?.data?.item?.currentStock;
            const preQuantity =
              invoiceItemRes.data.purchaseInvoiceItem.quantity;

            const newCurrentStock =
              preCurrentStock - preQuantity + value.quantity;
            if (newCurrentStock < 0) {
              setWorning(`Increment quantity of ${itemRes?.data?.item.name}.`);
              return 0;
            }
          }
        }
      }

      // Image
      let uploadedFiles: string | undefined = undefined;
      if (data.invoiceImage && invoiceRes?.supplierInvoice?.invoiceImage) {
        // delete old image
        const deleted = await deleteImageFromS3(
          invoiceRes?.supplierInvoice.invoiceImage
        );
        if (!deleted) throw new Error("Failed to delete image");
      }
      if (data.invoiceImage) {
        uploadedFiles = await uploadImageToS3(data.invoiceImage);
        if (!uploadedFiles) throw new Error("Failed to upload image");
      }

      let amount = 0;
      for (const [, value] of selectedItems) {
        amount += value.price * value.quantity;
      }

      const res = await invoiceMutation({
        variables: {
          ...data,
          invoiceNumber: randomId(),
          amount: amount,
          paidAmount: invoiceId ? invoiceRes?.supplierInvoice?.paidAmount : 0,
          invoiceImage: uploadedFiles
            ? uploadedFiles
            : invoiceRes?.supplierInvoice.invoiceImage,
          id: invoiceId || undefined,
          supplier: data.supplier || undefined,
          status: PAYMENT_STATUSES.PENDING,
          due: invoiceId
            ? toFixed(invoiceRes?.supplierInvoice?.due)
            : toFixed(amount),
        },
      });

      if (res.data?.supplierInvoiceCud?.success) {
        for (const [id, value] of selectedItems) {
          const itemVariable = {
            id: value.id ? value.id : undefined,
            item: id,
            quantity: value.quantity,
            price: value.price,
            supplierInvoice: res.data?.supplierInvoiceCud.supplierInvoice.id,
          };
          await invoiceItemMutation({ variables: itemVariable });
        }
      }

      // the delete existing invoice item
      if (invoiceId) {
        const invoiceItemsDelete: string[] = [];
        invoiceItemsRes?.purchaseInvoiceItems?.edges?.forEach(
          ({ node }: { node: SUPPLIER_INVOICE_ITEM_TYPE }) => {
            if (!selectedItems.get(`${node.item.id}`)) {
              invoiceItemsDelete.push(node.id);
            }
          }
        );
        await Promise.all(
          invoiceItemsDelete.map((itemId) =>
            deleteInvoiceItem({
              variables: {
                id: itemId,
              },
            })
          )
        );
      }

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      form.reset({
        supplier: "",
        invoiceImage: undefined,
      });
      setImagePreviewUrl("");
      setIsModalOpen(true);
      clearItems();
      setWorning("");

      if (invoiceId) {
        router.push("/supplier-invoices");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setWorning("");
    }
  }

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const isLoading =
    deleteInvoiceItemMutationLoading ||
    invoiceItemQueryLoading ||
    itemQueryLoading ||
    supplier_loading ||
    loading ||
    itemCreate_loading ||
    invoiceQueryLoading ||
    invoiceItemsQueryLoading;
  if (isLoading) return <Loading />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {invoiceId ? "Update Invoice" : "Create Invoice"}
            </CardTitle>
            <CardDescription>
              {invoiceId ? "Update invoice" : "Create a new invoice "}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ItemAddForm items={items} />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SwitchItem
                  disabled={
                    supplier_loading || Boolean(form.watch("invoiceImage"))
                  }
                  form={form}
                  name="supplier"
                  label="Supplier"
                  options={suppliers}
                  placeholder="Select supplier"
                />
                <FormField
                  control={form.control}
                  name="invoiceImage"
                  render={({ field: { ...field } }) => (
                    <FormItem>
                      <FormLabel>Invoice Image</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!!form.watch("supplier")}
                          {...field}
                          value=""
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e);
                          }}
                          className="flex items-center justify-center h-11"
                        />
                      </FormControl>
                      <FormMessage />
                      {imagePreviewUrl && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="relative aspect-square">
                            <Image
                              width={100}
                              height={100}
                              src={imagePreviewUrl}
                              alt={`Preview`}
                              className="object-cover w-full h-full rounded-md"
                            />
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {worning && <Info message={worning} />}

            <button
              type="submit"
              disabled={create_loading || itemCreate_loading}
            >
              <SupplierPaymentModal
                orderId={orderId}
                disabled={create_loading || itemCreate_loading}
                openBtnName="Create"
                openBtnClassName="w-40"
                modalState={[isModelOpen, setIsModalOpen]}
              />
            </button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
export default SupplierInvoiceForm;
