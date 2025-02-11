"use client"
import withProtection from "@/HOC/ProtectedRoute"
import { ADMIN, MANAGER } from "@/constants/role.constants"
import Pos from "../components/pos/pos"


function POS() {

    return (
        <div className=" flex p-4 items-center justify-center  ">
            <Pos />
        </div>
    )
}
export default withProtection(POS, [ADMIN, MANAGER,])