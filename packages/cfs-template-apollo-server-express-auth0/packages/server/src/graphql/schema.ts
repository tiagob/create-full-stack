import { gql } from "apollo-server-express";

// If changes are made to the schema, you must generate the TS types and React
// hooks for the Apollo clients and server with `yarn generate`.

export default gql`
  type Todo {
    id: Int!
    name: String!
    complete: Boolean!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    createTodo(name: String!): Todo!
    updateTodo(id: Int!, name: String, complete: Boolean): Todo
    deleteTodo(id: Int!): Todo
  }
`;
