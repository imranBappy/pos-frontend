"use client";
import { useMutation } from "@apollo/client";
import {
  PAYMENT_STATUSES,
} from "@/constants/payment.constants";
import { toast } from "@/hooks/use-toast";
import { randomId, toFixed } from "@/lib/utils";
import Modal from "@/components/modal";
import {  SUPPLIER_INVOICES_QUERY } from "@/graphql/supplier-invoice/queries";
import { SUPPLIER_INVOICE_ITEM_MUTATION, SUPPLIER_INVOICE_MUTATION } from "@/graphql/supplier-invoice/mutations";
import useStore from "@/stores";
import Button from "@/components/button";
import { Form } from "@/components/ui";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/input";
import { useEffect } from "react";
import { SUPPLIER_TYPE } from "@/graphql/supplier/types";


interface PaymentProps {
    modalState: [boolean, setIsModalOpen: (value: boolean) => void];
    selectedUser: SUPPLIER_TYPE | undefined;
}
const paymentFormSchema = z.object({
    invoiceNumber: z.string(),
    poNumber: z.string().optional(),
    duePaymentDate: z.string().optional(),
});
type ordeFormValues = z.infer<typeof paymentFormSchema>

interface PaymentProps {
    modalState: [boolean, setIsModalOpen: (value: boolean) => void]
}

const OrderItemConfirm = ({ modalState, selectedUser }: PaymentProps) => {
  const [isModelOpen, setIsModalOpen] = modalState;
  const selectedItems = useStore((store)=>store.items)
  const clearItems = useStore((store) => store.clearItems);

   const orderForm = useForm<ordeFormValues>({
          resolver: zodResolver(paymentFormSchema),
      })
 

    useEffect(() => {
      orderForm.setValue('invoiceNumber', randomId());
           orderForm.setValue('poNumber', randomId());
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);


  const [invoiceMutation, { loading: create_loading }] = useMutation(
    SUPPLIER_INVOICE_MUTATION,
    {
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

   let amount = 0;
   let vat = 0;
   for (const [, value] of selectedItems) {
     amount += value.price * value.quantity;
     vat += value.vat * value.quantity;
   }
  async function onSubmit(data: ordeFormValues) {
      try {
        //   if (!selectedUser?.id) {
        //       toast({
        //           description: 'Select supplier or Input invoice image',
        //           variant: 'destructive',
        //       });
        //       return;
        //   }
          if (!selectedItems.size) {
              toast({
                  description: 'Add Minimum 1 item',
                  variant: 'destructive',
              });
              return;
          }
          // validation parchage items
          for (const [, value] of selectedItems) {
              if (value.quantity < 1) {
                  toast({
                      description: 'Quantity can not be less 1',
                      variant: 'destructive',
                  });
                  return;
              }
              if (value.price < 1) {
                  toast({
                      description: 'Price can not be less 0',
                      variant: 'destructive',
                  });
                  return;
              }
          }

          let amount = 0;
          let vat = 0;
          for (const [, value] of selectedItems) {
              amount += value.price * value.quantity;
              vat += value.vat * value.quantity;
          }

          const res = await invoiceMutation({
              variables: {
                  invoiceNumber: data.invoiceNumber,
                  duePaymentDate: data.duePaymentDate,
                  poNumber: data.poNumber,

                  finalAmount: amount + vat,
                  amount: amount, // without vat
                  paidAmount: 0, // new paided amount
                  invoiceImage: undefined,
                  supplier: selectedUser?.id,
                  status: PAYMENT_STATUSES.PENDING,
                  due: toFixed(amount),
              },
          });

          if (res.data?.supplierInvoiceCud?.success) {
              for (const [id, value] of selectedItems) {
                  const itemVariable = {
                      id: value.id ? value.id : undefined,
                      item: id,
                      quantity: value.quantity,
                      price: value.price,
                      supplierInvoice:
                          res.data?.supplierInvoiceCud.supplierInvoice.id,
                      vat: value.vat,
                  };
                  await invoiceItemMutation({ variables: itemVariable });
              }
          }

          toast({
              title: 'Success',
              description: 'Invoice created successfully',
          });

          setIsModalOpen(false);
          clearItems();
      } catch (error) {
          toast({
              title: 'Error',
              description:
                  error instanceof Error
                      ? error.message
                      : 'An unknown error occurred',
              variant: 'destructive',
          });
      }
  }

  return (
      <Modal
          openBtnName={'Confirm '}
          title="Confirm Order"
          // disabled={}
          variant={'default'}
          isCloseBtn={false}
          open={isModelOpen}
          onOpenChange={(value) => (value ? null : setIsModalOpen(value))}
      >
          <div className="w-full">
              <Form {...orderForm}>
                  <form
                      onSubmit={orderForm.handleSubmit(onSubmit)}
                      className=" "
                  >
                      <div className="w-full  ">
                          <div className="mb-10 flex flex-col gap-5">
                              <div className="w-full  flex  gap-2">
                                  <div className="w-full ">
                                      <TextField
                                          form={orderForm}
                                          name="invoiceNumber"
                                          label="Invoice Number"
                                          placeholder="Enter Invoice Number"
                                      />
                                  </div>
                                  <div className="w-full ">
                                      <TextField
                                          form={orderForm}
                                          name="poNumber"
                                          label="PO Number"
                                          placeholder="PO Number"
                                      />
                                  </div>
                              </div>
                              <TextField
                                  form={orderForm}
                                  name="duePaymentDate"
                                  label="Due Date"
                                  placeholder="Due Date"
                                  type="date"
                              />
                          </div>
                          <div className="flex flex-col  gap-2">
                              <div className="  flex text-base justify-between">
                                  <span>Total Item</span>
                                  <span> {selectedItems.size} </span>
                              </div>
                              <div className="  text-base flex  justify-between">
                                  <span>Subtotal</span>
                                  <span>$ {amount} </span>
                              </div>
                              <div className="flex text-base justify-between">
                                  <span>VAT</span>
                                  <span>$ {vat}</span>
                              </div>
                              <div className="flex text-base justify-between font-bold">
                                  <span>Total</span>
                                  <span>$ {amount + vat}</span>
                              </div>
                          </div>

                          <div className="mt-7 flex justify-end">
                              <Button
                                  isLoading={
                                      create_loading || itemCreate_loading
                                  }
                              >
                                  Confirm
                              </Button>
                          </div>
                      </div>
                  </form>
              </Form>
          </div>
      </Modal>
  );
};

export default OrderItemConfirm;
