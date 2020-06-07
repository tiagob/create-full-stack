import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Maybe<T> = T | null;
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
  updateTodo?: Maybe<Todo>;
  destroyTodo?: Maybe<Todo>;
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

export type TodosQueryVariables = {};

export type TodosQuery = { __typename?: "Query" } & {
  todos: Array<
    { __typename?: "Todo" } & Pick<Todo, "id" | "name" | "complete">
  >;
};

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
  updateTodo?: Maybe<
    { __typename?: "Todo" } & Pick<Todo, "id" | "name" | "complete">
  >;
};

export type DestroyTodoMutationVariables = {
  id: Scalars["Int"];
};

export type DestroyTodoMutation = { __typename?: "Mutation" } & {
  destroyTodo?: Maybe<{ __typename?: "Todo" } & Pick<Todo, "id">>;
};

export const TodosDocument = gql`
  query Todos {
    todos {
      id
      name
      complete
    }
  }
`;

/**
 * __useTodosQuery__
 *
 * To run a query within a React component, call `useTodosQuery` and pass it any options that fit your needs.
 * When your component renders, `useTodosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodosQuery({
 *   variables: {
 *   },
 * });
 */
export function useTodosQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TodosQuery,
    TodosQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    baseOptions
  );
}
export function useTodosLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TodosQuery,
    TodosQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    baseOptions
  );
}
export type TodosQueryHookResult = ReturnType<typeof useTodosQuery>;
export type TodosLazyQueryHookResult = ReturnType<typeof useTodosLazyQuery>;
export type TodosQueryResult = ApolloReactCommon.QueryResult<
  TodosQuery,
  TodosQueryVariables
>;
export const CreateTodoDocument = gql`
  mutation CreateTodo($name: String!) {
    createTodo(name: $name) {
      id
      name
      complete
    }
  }
`;
export type CreateTodoMutationFn = ApolloReactCommon.MutationFunction<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTodoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >(CreateTodoDocument, baseOptions);
}
export type CreateTodoMutationHookResult = ReturnType<
  typeof useCreateTodoMutation
>;
export type CreateTodoMutationResult = ApolloReactCommon.MutationResult<
  CreateTodoMutation
>;
export type CreateTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;
export const UpdateTodoDocument = gql`
  mutation UpdateTodo($id: Int!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete) {
      id
      name
      complete
    }
  }
`;
export type UpdateTodoMutationFn = ApolloReactCommon.MutationFunction<
  UpdateTodoMutation,
  UpdateTodoMutationVariables
>;

/**
 * __useUpdateTodoMutation__
 *
 * To run a mutation, you first call `useUpdateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTodoMutation, { data, loading, error }] = useUpdateTodoMutation({
 *   variables: {
 *      id: // value for 'id'
 *      complete: // value for 'complete'
 *   },
 * });
 */
export function useUpdateTodoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateTodoMutation,
    UpdateTodoMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateTodoMutation,
    UpdateTodoMutationVariables
  >(UpdateTodoDocument, baseOptions);
}
export type UpdateTodoMutationHookResult = ReturnType<
  typeof useUpdateTodoMutation
>;
export type UpdateTodoMutationResult = ApolloReactCommon.MutationResult<
  UpdateTodoMutation
>;
export type UpdateTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateTodoMutation,
  UpdateTodoMutationVariables
>;
export const DestroyTodoDocument = gql`
  mutation DestroyTodo($id: Int!) {
    destroyTodo(id: $id) {
      id
    }
  }
`;
export type DestroyTodoMutationFn = ApolloReactCommon.MutationFunction<
  DestroyTodoMutation,
  DestroyTodoMutationVariables
>;

/**
 * __useDestroyTodoMutation__
 *
 * To run a mutation, you first call `useDestroyTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyTodoMutation, { data, loading, error }] = useDestroyTodoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDestroyTodoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DestroyTodoMutation,
    DestroyTodoMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    DestroyTodoMutation,
    DestroyTodoMutationVariables
  >(DestroyTodoDocument, baseOptions);
}
export type DestroyTodoMutationHookResult = ReturnType<
  typeof useDestroyTodoMutation
>;
export type DestroyTodoMutationResult = ApolloReactCommon.MutationResult<
  DestroyTodoMutation
>;
export type DestroyTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DestroyTodoMutation,
  DestroyTodoMutationVariables
>;
