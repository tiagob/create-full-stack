import gql from "graphql-tag";
import * as ReactApollo from "react-apollo";
import * as React from "react";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
export type CreateTodoComponentProps = Omit<
  ReactApollo.MutationProps<CreateTodoMutation, CreateTodoMutationVariables>,
  "mutation"
>;

export const CreateTodoComponent = (props: CreateTodoComponentProps) => (
  <ReactApollo.Mutation<CreateTodoMutation, CreateTodoMutationVariables>
    mutation={CreateTodoDocument}
    {...props}
  />
);

export type CreateTodoProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<CreateTodoMutation, CreateTodoMutationVariables>
> &
  TChildProps;
export function withCreateTodo<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CreateTodoMutation,
    CreateTodoMutationVariables,
    CreateTodoProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    CreateTodoMutation,
    CreateTodoMutationVariables,
    CreateTodoProps<TChildProps>
  >(CreateTodoDocument, {
    alias: "withCreateTodo",
    ...operationOptions
  });
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
export type UpdateTodoComponentProps = Omit<
  ReactApollo.MutationProps<UpdateTodoMutation, UpdateTodoMutationVariables>,
  "mutation"
>;

export const UpdateTodoComponent = (props: UpdateTodoComponentProps) => (
  <ReactApollo.Mutation<UpdateTodoMutation, UpdateTodoMutationVariables>
    mutation={UpdateTodoDocument}
    {...props}
  />
);

export type UpdateTodoProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<UpdateTodoMutation, UpdateTodoMutationVariables>
> &
  TChildProps;
export function withUpdateTodo<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpdateTodoMutation,
    UpdateTodoMutationVariables,
    UpdateTodoProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    UpdateTodoMutation,
    UpdateTodoMutationVariables,
    UpdateTodoProps<TChildProps>
  >(UpdateTodoDocument, {
    alias: "withUpdateTodo",
    ...operationOptions
  });
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
export type DestroyTodoComponentProps = Omit<
  ReactApollo.MutationProps<DestroyTodoMutation, DestroyTodoMutationVariables>,
  "mutation"
>;

export const DestroyTodoComponent = (props: DestroyTodoComponentProps) => (
  <ReactApollo.Mutation<DestroyTodoMutation, DestroyTodoMutationVariables>
    mutation={DestroyTodoDocument}
    {...props}
  />
);

export type DestroyTodoProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<DestroyTodoMutation, DestroyTodoMutationVariables>
> &
  TChildProps;
export function withDestroyTodo<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DestroyTodoMutation,
    DestroyTodoMutationVariables,
    DestroyTodoProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    DestroyTodoMutation,
    DestroyTodoMutationVariables,
    DestroyTodoProps<TChildProps>
  >(DestroyTodoDocument, {
    alias: "withDestroyTodo",
    ...operationOptions
  });
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
export type TodosComponentProps = Omit<
  ReactApollo.QueryProps<TodosQuery, TodosQueryVariables>,
  "query"
>;

export const TodosComponent = (props: TodosComponentProps) => (
  <ReactApollo.Query<TodosQuery, TodosQueryVariables>
    query={TodosDocument}
    {...props}
  />
);

export type TodosProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<TodosQuery, TodosQueryVariables>
> &
  TChildProps;
export function withTodos<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    TodosQuery,
    TodosQueryVariables,
    TodosProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    TodosQuery,
    TodosQueryVariables,
    TodosProps<TChildProps>
  >(TodosDocument, {
    alias: "withTodos",
    ...operationOptions
  });
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
