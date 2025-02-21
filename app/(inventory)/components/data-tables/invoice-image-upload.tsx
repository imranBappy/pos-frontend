'use client';

import Button from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle, Loading } from '@/components/ui';
import { SUPPLIER_INVOICE_MUTATION } from '@/graphql/supplier-invoice/mutations';
import { SUPPLIER_INVOICE_QUERY, SUPPLIER_INVOICES_QUERY } from '@/graphql/supplier-invoice/queries';
import { SUPPLIER_INVOICE_TYPE } from '@/graphql/supplier-invoice/types';
import { useToast } from '@/hooks/use-toast';
import uploadImageToS3, { deleteImageFromS3 } from '@/lib/s3';
import { useMutation, useQuery } from '@apollo/client';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, ChangeEvent, useEffect } from 'react';

const InvoiceImageUpdate = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const { toast } = useToast();
    const router = useRouter()
    const searchQuery = useSearchParams()
    const invoiceId:string = searchQuery.get('id') || '';

    const { data: invoiceRes, loading: invoiceQueryLoading } = useQuery(
        SUPPLIER_INVOICE_QUERY,
        {
            variables: { id: invoiceId },
            onCompleted: (res) => {
                const supplierInvoice = res?.supplierInvoice;
                if (supplierInvoice?.invoiceImage) {
                    setImagePreview(supplierInvoice?.invoiceImage);
                }
            },
            onError: () => {
                router.push('/supplier-invoices');
            },
            skip: !invoiceId,
        }
    );
    // Invoice Mutation
    const [invoiceMutation, { loading: create_loading }] = useMutation(
        SUPPLIER_INVOICE_MUTATION,
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


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (file) {
            // Basic validation
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                setError('File size must be less than 5MB');
                return;
            }
            

            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleUpload = async () => {
        if (!imageFile) return;
        
        const supplierInvoice: SUPPLIER_INVOICE_TYPE = invoiceRes.supplierInvoice || {};
        if (!supplierInvoice?.id) return;


        setIsUploading(true);
        setError(null);
        setUploadSuccess(false);

        try {
            // Create FormData object to send the file
        let uploadedFiles: string | undefined = undefined;
      if (imageFile && supplierInvoice?.invoiceImage) {
        // delete old image
        const deleted = await deleteImageFromS3(
          supplierInvoice.invoiceImage
        );
        if (!deleted) throw new Error("Failed to delete image");
      }
      if (imageFile) {
        uploadedFiles = await uploadImageToS3(imageFile);
        if (!uploadedFiles) throw new Error("Failed to upload image");
      }
            // data
               await invoiceMutation({
                   variables: {
                       ...supplierInvoice,
                       invoiceNumber: supplierInvoice.invoiceNumber,
                       amount: supplierInvoice.amount,
                       paidAmount: invoiceId ? supplierInvoice?.paidAmount : 0,
                       invoiceImage: uploadedFiles
                           ? uploadedFiles
                           : supplierInvoice.invoiceImage,
                       id: supplierInvoice.id,
                       supplier: supplierInvoice?.supplier?.id,
                       status: supplierInvoice.status,
                       due: supplierInvoice?.due,
                   },
               });

            toast({ description: 'Upload successful!' });

            // Optional: Reset form after successful upload
            setImageFile(null);
            setImagePreview(null);
            router.push('/supplier-invoices');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    if (invoiceQueryLoading) {
        return <Loading/>
    }

    return (
        <div className="flex justify-center items-center mt-10">
            <Card className="min-w-[600px] ">
                <CardHeader>
                    <CardTitle>Invoice Image Upload</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className=" flex  flex-col items-center justify-center gap-4">
                        <label
                            htmlFor="upload"
                            className="flex flex-col gap-4 items-center cursor-pointer"
                        >
                            {imagePreview ? (
                                <Image
                                    width={700}
                                    height={1000}
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-[600px]  object-contain"
                                />
                            ) : (
                                <Upload size={200} />
                            )}
                            <input
                                onChange={handleImageChange}
                                type="file"
                                className="hidden"
                                id="upload"
                                accept="image/*"
                                disabled={isUploading}
                            />
                        </label>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                        {uploadSuccess && (
                            <p className="text-green-500 text-sm">
                                Upload successful!
                            </p>
                        )}

                        <div className="flex gap-2">
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() =>
                                    document.getElementById('upload')?.click()
                                }
                                disabled={isUploading}
                            >
                                {imageFile ? 'Change Image' : 'Select Image'}
                            </Button>
                            {imageFile && (
                                <Button
                                    className="w-full"
                                    onClick={handleUpload}
                                    disabled={
                                        isUploading ||
                                        create_loading ||
                                        invoiceQueryLoading
                                    }
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceImageUpdate;
