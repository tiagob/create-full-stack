import gql from "graphql-tag";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
export type Maybe<T> = T | null;

export const CreateTodoDocument = gql`
  mutation CreateTodo($name: String!) {
    createTodo(name: $name) {
      id
      name
      complete
    }
  }
`;
export type CreateTodoMutationFn = ReactApollo.MutationFn<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;

export function useCreateTodoMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >(CreateTodoDocument, baseOptions);
}
export const UpdateTodoDocument = gql`
  mutation UpdateTodo($id: Int!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete) {
      id
      name
      complete
    }
  }
`;
export type UpdateTodoMutationFn = ReactApollo.MutationFn<
  UpdateTodoMutation,
  UpdateTodoMutationVariables
>;

export function useUpdateTodoMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    UpdateTodoMutation,
    UpdateTodoMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    UpdateTodoMutation,
    UpdateTodoMutationVariables
  >(UpdateTodoDocument, baseOptions);
}
export const DestroyTodoDocument = gql`
  mutation DestroyTodo($id: Int!) {
    destroyTodo(id: $id) {
      id
    }
  }
`;
export type DestroyTodoMutationFn = ReactApollo.MutationFn<
  DestroyTodoMutation,
  DestroyTodoMutationVariables
>;

export function useDestroyTodoMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DestroyTodoMutation,
    DestroyTodoMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DestroyTodoMutation,
    DestroyTodoMutationVariables
  >(DestroyTodoDocument, baseOptions);
}
export const TodosDocument = gql`
  query Todos {
    todos {
      id
      name
      complete
    }
  }
`;

export function useTodosQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<TodosQueryVariables>
) {
  return ReactApolloHooks.useQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    baseOptions
  );
}
export type CreateTodoMutationVariables = {
  name: Scalars["String"];
};

export type CreateTodoMutation = { __typename?: "Mutation" } & {
  createTodo: { __typename?: "Todo" } & Pick<Todo, "id" | "name" | "complete">;
};

export type UpdateTodoMutationVariables = {
  id: Scalars["Int"];
  complete: Scalars["Boolean"];
};

export type UpdateTodoMutation = { __typename?: "Mutation" } & {
  updateTodo: { __typename?: "Todo" } & Pick<Todo, "id" | "name" | "complete">;
};

export type DestroyTodoMutationVariables = {
  id: Scalars["Int"];
};

export type DestroyTodoMutation = { __typename?: "Mutation" } & {
  destroyTodo: { __typename?: "Todo" } & Pick<Todo, "id">;
};

export type TodosQueryVariables = {};

export type TodosQuery = { __typename?: "Query" } & {
  todos: Array<
    { __typename?: "Todo" } & Pick<Todo, "id" | "name" | "complete">
  >;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: "Mutation";
  createTodo: Todo;
  updateTodo: Todo;
  destroyTodo: Todo;
};

export type MutationCreateTodoArgs = {
  name: Scalars["String"];
};

export type MutationUpdateTodoArgs = {
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  complete?: Maybe<Scalars["Boolean"]>;
};

export type MutationDestroyTodoArgs = {
  id: Scalars["Int"];
};

export type Query = {
  __typename?: "Query";
  todos: Array<Todo>;
};

export type Todo = {
  __typename?: "Todo";
  id: Scalars["Int"];
  name: Scalars["String"];
  complete: Scalars["Boolean"];
};
