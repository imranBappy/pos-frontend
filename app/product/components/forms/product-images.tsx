import Image from "next/image";
import { useState, useEffect } from "react";
import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from 'react';
type IMAGE_TYPE = { file: File, url: string };
type IMAGE_URLS = IMAGE_TYPE[];
interface ProductImagesProps {
    urls: IMAGE_TYPE[];
    setUrl: React.Dispatch<React.SetStateAction<IMAGE_URLS>>;
}
const ProductImages = ({ urls, setUrl }: ProductImagesProps) => {
    const [imageUrls, setImageUrls] = useState<IMAGE_URLS>(urls || []);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    useEffect(() => {
        if (urls.length) {
            setImageUrls(urls);
        }
    }, [urls]);

    const handleOnDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
    };

    const handleOnDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        const updatedUrls = [...imageUrls];
        const [removed] = updatedUrls.splice(draggedIndex, 1);
        updatedUrls.splice(index, 0, removed);

        setImageUrls(updatedUrls);
        setUrl(updatedUrls)
        setDraggedIndex(null);
    };

    const handleAllowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDeleteImage = (index: number) => {
        const updatedUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(updatedUrls);
        setUrl(updatedUrls)
    };


    return imageUrls.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 mt-4 border rounded">
            {imageUrls.map((item: IMAGE_TYPE, index) => (
                <div
                    key={index}
                    className="relative aspect-square border m-1 rounded"
                    draggable
                    onDragStart={(e) => handleOnDragStart(e, index)}
                    onDragOver={handleAllowDrop}
                    onDrop={(e) => handleOnDrop(e, index)}
                >
                    <Image
                        width={100}
                        height={100}
                        src={item.file ? URL.createObjectURL(item.file) : item.url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full rounded-md"
                    />
                    <Button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0! h-5 rounded-sm shadow hover:bg-red-600"
                    >
                        <Minus />
                    </Button>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-gray-500 text-center mt-4">No images available.</p>
    );
};

export default ProductImages;
