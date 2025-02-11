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