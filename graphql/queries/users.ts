import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($page: Int, $pageSize: Int, $filter: UserFilter) {
    users(page: $page, pageSize: $pageSize, filter: $filter) {
      users {
        id
        name
        email
        role
        status
        createdAt
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      email
      role
      status
    }
  }
`;
