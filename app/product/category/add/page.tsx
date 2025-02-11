"use client"
import withProtection from "@/HOC/ProtectedRoute"
import { ADMIN } from "@/constants/role.constants"
import CategoryForm from "@/app/product/components/forms/category-form"


function CardWithForm() {
    return (
        <div className=" flex p-5 items-center justify-center  ">
            <CategoryForm />
        </div>
    )
}
export default withProtection(CardWithForm, [ADMIN])