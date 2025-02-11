import { gql } from "@apollo/client";


export const OUTLET_MUTATION = gql`
mutation MyMutation($id:String, $address: String!, $email: String!, $name: String!, $phone: String!) {
  outletCud(input: {id: $id, name: $name, phone: $phone, email: $email, address: $address, isActive:true}) {
    success
    message
  }
}
`