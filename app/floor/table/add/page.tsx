"use client"
import withProtection from "@/HOC/ProtectedRoute"
import { ADMIN } from "@/constants/role.constants"
import { FloorTableForm } from "../../components/forms/floor-table-form"


function CardWithForm() {
    return (
        <div className=" flex p-5 items-center justify-center  ">
            <FloorTableForm />
        </div>
    )
}
export default withProtection(CardWithForm, [ADMIN])