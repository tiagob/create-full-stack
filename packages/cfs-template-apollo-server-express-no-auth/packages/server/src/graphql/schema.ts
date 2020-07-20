import { gql } from "apollo-server-express";

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
