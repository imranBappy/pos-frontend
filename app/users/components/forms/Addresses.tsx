
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AddressForm from "./address-form"
import { Separator } from "@/components/ui"
interface ADDRESS_TAB_TYPE {
    userId: string,
}
export function AddressTabs({ userId }: ADDRESS_TAB_TYPE) {
    return (
        <>
            <Separator />
            <Tabs defaultValue="HOME" className="mt-5 " >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="HOME">Home</TabsTrigger>
                    <TabsTrigger value="OFFICE">Office</TabsTrigger>
                </TabsList>
                <TabsContent value="HOME">
                    <AddressForm id={userId} addressType={'HOME'} />
                </TabsContent>
                <TabsContent value="OFFICE">
                    <AddressForm id={userId} addressType={'OFFICE'} />
                </TabsContent>
            </Tabs>
        </>
    )
}

export default AddressTabs