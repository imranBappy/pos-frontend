'use client';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from '@/hooks/use-toast';
import Modal from '@/components/modal';
import { SUPPLIER_INVOICES_QUERY } from '@/graphql/supplier-invoice/queries';
import useStore from '@/stores';
import Button from '@/components/button';
import { Form, Loading } from '@/components/ui';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    OPTION_TYPE,
    SwitchItem,
    TextareaField,
    TextField,
} from '@/components/input';
import { USER_TYPE } from '@/graphql/accounts';
import { WASTE_CATEGORIES_QUERY } from '@/graphql/waste/queries';
import { CATEGORY_TYPE } from '@/graphql/product';
import { CREATE_WASTE_MUTATION } from '@/graphql/waste/mutations';

interface PaymentProps {
    modalState: [boolean, setIsModalOpen: (value: boolean) => void];
    selectedUser: USER_TYPE | undefined;
}
const paymentFormSchema = z.object({
    date: z.string(),
    category: z.string(),
    notes: z.string().optional(),
});
type ordeFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentProps {
    modalState: [boolean, setIsModalOpen: (value: boolean) => void];
}

const WasteItemConfirm = ({ modalState, selectedUser }: PaymentProps) => {
    const [isModelOpen, setIsModalOpen] = modalState;
    const selectedItems = useStore((store) => store.items);
    const clearItems = useStore((store) => store.clearItems);
   
    const orderForm = useForm<ordeFormValues>({
        resolver: zodResolver(paymentFormSchema),
    });
    const { data: categories_res, loading: categories_loading } = useQuery(
        WASTE_CATEGORIES_QUERY,
        {
            variables: {
                isCategory: true,
            },
        }
    );
    const categories: OPTION_TYPE[] = categories_res?.wasteCategories.edges.map(
        (edge: { node: CATEGORY_TYPE }) => ({
            value: edge.node.id,
            label: edge.node.name,
        })
    );

    const [invoiceMutation, { loading: create_loading }] = useMutation(
        CREATE_WASTE_MUTATION,
        {
            refetchQueries: [
                {
                    query: SUPPLIER_INVOICES_QUERY,
                    variables: {
                        offset: 0,
                        first: 10,
                        search: '',
                    },
                },
            ],
            awaitRefetchQueries: true,
        }
    );

    async function onSubmit(data: ordeFormValues) {
        try {
            if (!selectedItems.size) {
                toast({
                    description: 'Add Minimum 1 item',
                    variant: 'destructive',
                });
                return;
            }
            // validation purchase items
            for (const [, value] of selectedItems) {
                if (value.quantity < 1) {
                    toast({
                        description: 'Quantity can not be less 1',
                        variant: 'destructive',
                    });
                    return;
                }
            }

            const wastedItems = [];
            for (const [id, value] of selectedItems) {
                const itemVariable = {
                    ingredient: id,
                    quantity: value.quantity,
                };
                wastedItems.push(itemVariable);
            }
            await invoiceMutation({
                variables: {
                    input: {
                        date: data.date,
                        responsible: selectedUser?.id,
                        notes: data.notes,
                        category: data.category,
                        items: wastedItems,
                    },
                },
            });

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

    if (categories_loading ) {
        return <Loading />;
    }

    return (
        <Modal
            openBtnName={'Confirm '}
            title="Confirm waste"
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
                                            name="date"
                                            label="Wasted date"
                                            placeholder="Wasted date"
                                            type="date"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <SwitchItem
                                            disabled={categories_loading}
                                            form={orderForm}
                                            name="category"
                                            label="Category"
                                            options={categories}
                                            placeholder="Select category"
                                        />
                                    </div>
                                </div>
                                <TextareaField
                                    form={orderForm}
                                    name="notes"
                                    label="Notes"
                                    placeholder="Notes"
                                />
                            </div>
                            <div className="flex flex-col  gap-2">
                                <div className="  flex text-base gap-1 ">
                                    <span>Total Item : </span>
                                    <span> {selectedItems.size} </span>
                                </div>
                            </div>

                            <div className="mt-7 flex justify-end">
                                <Button isLoading={create_loading}>
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

export default WasteItemConfirm;
