"use client";
import React, { useState } from "react";
import { findVat } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Button from "@/components/button";
import { X, Plus } from "lucide-react";
import Link from "next/link";
import useStore from "@/stores";
import OrderItemsAndCategory from "./order-item-and-category";
import OrderCartItem from "./order-cart-item";
import { ITEM_TYPE } from "@/graphql/item/types";
import OrderItemConfirm from "./order-item-confirm";
import SupplierSearch from "@/components/SupplierSearch";
import { SUPPLIER_TYPE } from "@/graphql/supplier/types";

export const calculateDiscount = (
  price: number,
  vat: number,
  discount: number
) => {
  const total = findVat(price, vat) + price;
  const discountPrice = ((total - discount) / (100 + vat)) * 100;
  return discountPrice;
};



const OrderItem = () => {
 
 
 

 
  const [isModelOpen, setIsModalOpen] = useState(false);
 
  const selectedItems = useStore((store) => store.items);

  const selectedItemsArr:ITEM_TYPE[] = [];
  selectedItems.forEach((item, key) => {
    selectedItemsArr.push({ ...item, itemId: key });
  });

  const [selectedUser, setSelectedUser] = useState<SUPPLIER_TYPE>();
 
 let amount = 0;
 let vat = 0;
 for (const [, value] of selectedItems) {
   amount += value.price * value.quantity;
   vat += value.vat * value.quantity;
 }
    async function onSubmit() {
        setIsModalOpen(true)
        
  }

  const handleSelectUser = (newSelectedUser: SUPPLIER_TYPE) => {
    setSelectedUser(newSelectedUser);
  };

  return (
      <div className="w-full h-[calc(100vh-100px)] flex gap-4">
          <OrderItemsAndCategory />
          {/* Updated Cart Section */}
          <Card
              className="w-[350px] 
                col-span-1
                h-[calc(100vh-105px)]
                flex flex-col "
          >
              {/* Header with Customer Selection */}
              <div className="p-4 border-b">
                  <div className="space-y-3">
                      {/* Customer Search */}
                      <SupplierSearch onSelect={handleSelectUser} />
                      {/* Customer Info */}
                      <div className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="font-medium">
                                      {`${
                                          selectedUser?.name ||
                                          'Unknown Supplier'
                                      }`}{' '}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                      {selectedUser?.emailAddress ||
                                          'No email address'}
                                  </p>
                              </div>
                              {!selectedUser ? (
                                  <Link href={`/users/add`}>
                                      <Button size="sm" variant="outline">
                                          <Plus />
                                      </Button>
                                  </Link>
                              ) : (
                                  <Button
                                      onClick={() => setSelectedUser(undefined)}
                                      size="icon"
                                      variant="destructive"
                                  >
                                      <X />
                                  </Button>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Cart Items Section */}
              <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                      {/* Sample Cart Items */}
                      {selectedItemsArr?.map((item,i) => (
                          <OrderCartItem
                              id={item.itemId ||""}
                              key={`${item.itemId}-${i}`}
                          />
                      ))}
                  </div>
              </div>

              <div className="p-4 border-t ">
                  <div className="space-y-2">
                      <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>$ {amount} </span>
                      </div>
                      <div className="flex justify-between">
                          <span>VAT</span>
                          <span>${vat}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>$ {amount + vat}</span>
                      </div>
                      <div className=" mt-4  flex flex-col gap-2  ">
                          <div className="flex gap-2">
                              <Button
                                  disabled={selectedItems.size === 0}
                                  onClick={() => {
                                      onSubmit();
                                  }}
                                  className="w-full "
                              >
                                  Order
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </Card>
          <OrderItemConfirm
              selectedUser={selectedUser}
              modalState={[isModelOpen, setIsModalOpen]}
          />
      </div>
  );
};

export default OrderItem;
