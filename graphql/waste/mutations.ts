import { gql } from "@apollo/client";


export const WASTE_MUTATION = gql`
mutation MyMutation($date: Date!, $id: String, $note: String , $responsible: ID!, $totalLossAmount: Decimal!) {
  wasteCud(
    input: {date: $date, id: $id, note: $note, responsible: $responsible, totalLossAmount: $totalLossAmount}
  ) {
    message
    success
  }
}
`

export const CREATE_WASTE_MUTATION = gql`
    mutation CreateWaste($input: CreateWasteInputType!) {
        createWaste(input: $input) {
            success
        }
    }
`;

export const WASTE_CATEGORIES_MUTATION = gql`
    mutation MyMutation($description: String, $id: String, $name: String!) {
        wasteCategoryCud(
            input: { description: $description, id: $id, name: $name }
        ) {
            success
        }
    }
`;