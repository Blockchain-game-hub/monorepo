import { gql } from "@apollo/client";

export const GET_LOCKS_QUERY = gql`
  query GetLocksForAddress($address: String!) {
    locks(where: { owner: $address }) {
      id
      name
      price
      expirationDuration
    }
  }
`;
