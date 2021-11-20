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

export const GET_OWNER_KEYS_FOR_LOCK = gql`
  query OwnerKeysForLock($lockAddress: String!, $keyHolderAddress: String!) {
    locks(where: { address: $lockAddress }) {
      id
      name
      keys(where: { owner: $keyHolderAddress }) {
        id
        owner {
          id
        }
        expiration
        tokenURI
      }
    }
  }
`;

export const GET_OWNER_KEYS_FOR_LOCKS = gql`
  query OwnerKeysForLock(
    $lockAddresses: [String!]
    $keyHolderAddress: String!
  ) {
    locks(where: { address_in: $lockAddresses }) {
      id
      name
      keys(where: { owner: $keyHolderAddress }) {
        id
        owner {
          id
        }
        expiration
        tokenURI
      }
    }
  }
`;
