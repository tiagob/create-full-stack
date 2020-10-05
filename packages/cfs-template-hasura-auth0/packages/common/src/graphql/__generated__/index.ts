import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: Maybe<Scalars["Boolean"]>;
  _gt?: Maybe<Scalars["Boolean"]>;
  _gte?: Maybe<Scalars["Boolean"]>;
  _in?: Maybe<Array<Scalars["Boolean"]>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _lt?: Maybe<Scalars["Boolean"]>;
  _lte?: Maybe<Scalars["Boolean"]>;
  _neq?: Maybe<Scalars["Boolean"]>;
  _nin?: Maybe<Array<Scalars["Boolean"]>>;
};

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: Maybe<Scalars["Int"]>;
  _gt?: Maybe<Scalars["Int"]>;
  _gte?: Maybe<Scalars["Int"]>;
  _in?: Maybe<Array<Scalars["Int"]>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _lt?: Maybe<Scalars["Int"]>;
  _lte?: Maybe<Scalars["Int"]>;
  _neq?: Maybe<Scalars["Int"]>;
  _nin?: Maybe<Array<Scalars["Int"]>>;
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: Maybe<Scalars["String"]>;
  _gt?: Maybe<Scalars["String"]>;
  _gte?: Maybe<Scalars["String"]>;
  _ilike?: Maybe<Scalars["String"]>;
  _in?: Maybe<Array<Scalars["String"]>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _like?: Maybe<Scalars["String"]>;
  _lt?: Maybe<Scalars["String"]>;
  _lte?: Maybe<Scalars["String"]>;
  _neq?: Maybe<Scalars["String"]>;
  _nilike?: Maybe<Scalars["String"]>;
  _nin?: Maybe<Array<Scalars["String"]>>;
  _nlike?: Maybe<Scalars["String"]>;
  _nsimilar?: Maybe<Scalars["String"]>;
  _similar?: Maybe<Scalars["String"]>;
};

/** mutation root */
export type MutationRoot = {
  __typename?: "mutation_root";
  /** delete data from the table: "todos" */
  delete_todos?: Maybe<TodosMutationResponse>;
  /** delete single row from the table: "todos" */
  delete_todos_by_pk?: Maybe<Todos>;
  /** insert data into the table: "todos" */
  insert_todos?: Maybe<TodosMutationResponse>;
  /** insert a single row into the table: "todos" */
  insert_todos_one?: Maybe<Todos>;
  /** update data of the table: "todos" */
  update_todos?: Maybe<TodosMutationResponse>;
  /** update single row of the table: "todos" */
  update_todos_by_pk?: Maybe<Todos>;
};

/** mutation root */
export type MutationRootDeleteTodosArgs = {
  where: TodosBoolExp;
};

/** mutation root */
export type MutationRootDeleteTodosByPkArgs = {
  id: Scalars["Int"];
};

/** mutation root */
export type MutationRootInsertTodosArgs = {
  objects: Array<TodosInsertInput>;
  on_conflict?: Maybe<TodosOnConflict>;
};

/** mutation root */
export type MutationRootInsertTodosOneArgs = {
  object: TodosInsertInput;
  on_conflict?: Maybe<TodosOnConflict>;
};

/** mutation root */
export type MutationRootUpdateTodosArgs = {
  _inc?: Maybe<TodosIncInput>;
  _set?: Maybe<TodosSetInput>;
  where: TodosBoolExp;
};

/** mutation root */
export type MutationRootUpdateTodosByPkArgs = {
  _inc?: Maybe<TodosIncInput>;
  _set?: Maybe<TodosSetInput>;
  pk_columns: TodosPkColumnsInput;
};

/** column ordering options */
export enum OrderBy {
  /** in the ascending order, nulls last */
  Asc = "asc",
  /** in the ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in the ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in the descending order, nulls first */
  Desc = "desc",
  /** in the descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in the descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

/** query root */
export type QueryRoot = {
  __typename?: "query_root";
  /** fetch data from the table: "todos" */
  todos: Array<Todos>;
  /** fetch aggregated fields from the table: "todos" */
  todos_aggregate: TodosAggregate;
  /** fetch data from the table: "todos" using primary key columns */
  todos_by_pk?: Maybe<Todos>;
};

/** query root */
export type QueryRootTodosArgs = {
  distinct_on?: Maybe<Array<TodosSelectColumn>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<TodosOrderBy>>;
  where?: Maybe<TodosBoolExp>;
};

/** query root */
export type QueryRootTodosAggregateArgs = {
  distinct_on?: Maybe<Array<TodosSelectColumn>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<TodosOrderBy>>;
  where?: Maybe<TodosBoolExp>;
};

/** query root */
export type QueryRootTodosByPkArgs = {
  id: Scalars["Int"];
};

/** subscription root */
export type SubscriptionRoot = {
  __typename?: "subscription_root";
  /** fetch data from the table: "todos" */
  todos: Array<Todos>;
  /** fetch aggregated fields from the table: "todos" */
  todos_aggregate: TodosAggregate;
  /** fetch data from the table: "todos" using primary key columns */
  todos_by_pk?: Maybe<Todos>;
};

/** subscription root */
export type SubscriptionRootTodosArgs = {
  distinct_on?: Maybe<Array<TodosSelectColumn>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<TodosOrderBy>>;
  where?: Maybe<TodosBoolExp>;
};

/** subscription root */
export type SubscriptionRootTodosAggregateArgs = {
  distinct_on?: Maybe<Array<TodosSelectColumn>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<TodosOrderBy>>;
  where?: Maybe<TodosBoolExp>;
};

/** subscription root */
export type SubscriptionRootTodosByPkArgs = {
  id: Scalars["Int"];
};

/** columns and relationships of "todos" */
export type Todos = {
  __typename?: "todos";
  complete: Scalars["Boolean"];
  id: Scalars["Int"];
  name: Scalars["String"];
  uid?: Maybe<Scalars["String"]>;
};

/** aggregated selection of "todos" */
export type TodosAggregate = {
  __typename?: "todos_aggregate";
  aggregate?: Maybe<TodosAggregateFields>;
  nodes: Array<Todos>;
};

/** aggregate fields of "todos" */
export type TodosAggregateFields = {
  __typename?: "todos_aggregate_fields";
  avg?: Maybe<TodosAvgFields>;
  count?: Maybe<Scalars["Int"]>;
  max?: Maybe<TodosMaxFields>;
  min?: Maybe<TodosMinFields>;
  stddev?: Maybe<TodosStddevFields>;
  stddev_pop?: Maybe<TodosStddevPopFields>;
  stddev_samp?: Maybe<TodosStddevSampFields>;
  sum?: Maybe<TodosSumFields>;
  var_pop?: Maybe<TodosVarPopFields>;
  var_samp?: Maybe<TodosVarSampFields>;
  variance?: Maybe<TodosVarianceFields>;
};

/** aggregate fields of "todos" */
export type TodosAggregateFieldsCountArgs = {
  columns?: Maybe<Array<TodosSelectColumn>>;
  distinct?: Maybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "todos" */
export type TodosAggregateOrderBy = {
  avg?: Maybe<TodosAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<TodosMaxOrderBy>;
  min?: Maybe<TodosMinOrderBy>;
  stddev?: Maybe<TodosStddevOrderBy>;
  stddev_pop?: Maybe<TodosStddevPopOrderBy>;
  stddev_samp?: Maybe<TodosStddevSampOrderBy>;
  sum?: Maybe<TodosSumOrderBy>;
  var_pop?: Maybe<TodosVarPopOrderBy>;
  var_samp?: Maybe<TodosVarSampOrderBy>;
  variance?: Maybe<TodosVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "todos" */
export type TodosArrRelInsertInput = {
  data: Array<TodosInsertInput>;
  on_conflict?: Maybe<TodosOnConflict>;
};

/** aggregate avg on columns */
export type TodosAvgFields = {
  __typename?: "todos_avg_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "todos" */
export type TodosAvgOrderBy = {
  id?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "todos". All fields are combined with a logical 'AND'. */
export type TodosBoolExp = {
  _and?: Maybe<Array<Maybe<TodosBoolExp>>>;
  _not?: Maybe<TodosBoolExp>;
  _or?: Maybe<Array<Maybe<TodosBoolExp>>>;
  complete?: Maybe<BooleanComparisonExp>;
  id?: Maybe<IntComparisonExp>;
  name?: Maybe<StringComparisonExp>;
  uid?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "todos" */
export enum TodosConstraint {
  /** unique or primary key constraint */
  TodosPkey = "todos_pkey",
}

/** input type for incrementing integer column in table "todos" */
export type TodosIncInput = {
  id?: Maybe<Scalars["Int"]>;
};

/** input type for inserting data into table "todos" */
export type TodosInsertInput = {
  complete?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** aggregate max on columns */
export type TodosMaxFields = {
  __typename?: "todos_max_fields";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** order by max() on columns of table "todos" */
export type TodosMaxOrderBy = {
  id?: Maybe<OrderBy>;
  name?: Maybe<OrderBy>;
  uid?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type TodosMinFields = {
  __typename?: "todos_min_fields";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** order by min() on columns of table "todos" */
export type TodosMinOrderBy = {
  id?: Maybe<OrderBy>;
  name?: Maybe<OrderBy>;
  uid?: Maybe<OrderBy>;
};

/** response of any mutation on the table "todos" */
export type TodosMutationResponse = {
  __typename?: "todos_mutation_response";
  /** number of affected rows by the mutation */
  affected_rows: Scalars["Int"];
  /** data of the affected rows by the mutation */
  returning: Array<Todos>;
};

/** input type for inserting object relation for remote table "todos" */
export type TodosObjRelInsertInput = {
  data: TodosInsertInput;
  on_conflict?: Maybe<TodosOnConflict>;
};

/** on conflict condition type for table "todos" */
export type TodosOnConflict = {
  constraint: TodosConstraint;
  update_columns: Array<TodosUpdateColumn>;
  where?: Maybe<TodosBoolExp>;
};

/** ordering options when selecting data from "todos" */
export type TodosOrderBy = {
  complete?: Maybe<OrderBy>;
  id?: Maybe<OrderBy>;
  name?: Maybe<OrderBy>;
  uid?: Maybe<OrderBy>;
};

/** primary key columns input for table: "todos" */
export type TodosPkColumnsInput = {
  id: Scalars["Int"];
};

/** select columns of table "todos" */
export enum TodosSelectColumn {
  /** column name */
  Complete = "complete",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Uid = "uid",
}

/** input type for updating data in table "todos" */
export type TodosSetInput = {
  complete?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** aggregate stddev on columns */
export type TodosStddevFields = {
  __typename?: "todos_stddev_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "todos" */
export type TodosStddevOrderBy = {
  id?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type TodosStddevPopFields = {
  __typename?: "todos_stddev_pop_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "todos" */
export type TodosStddevPopOrderBy = {
  id?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type TodosStddevSampFields = {
  __typename?: "todos_stddev_samp_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "todos" */
export type TodosStddevSampOrderBy = {
  id?: Maybe<OrderBy>;
};

/** aggregate sum on columns */
export type TodosSumFields = {
  __typename?: "todos_sum_fields";
  id?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "todos" */
export type TodosSumOrderBy = {
  id?: Maybe<OrderBy>;
};

/** update columns of table "todos" */
export enum TodosUpdateColumn {
  /** column name */
  Complete = "complete",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Uid = "uid",
}

/** aggregate var_pop on columns */
export type TodosVarPopFields = {
  __typename?: "todos_var_pop_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "todos" */
export type TodosVarPopOrderBy = {
  id?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type TodosVarSampFields = {
  __typename?: "todos_var_samp_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "todos" */
export type TodosVarSampOrderBy = {
  id?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type TodosVarianceFields = {
  __typename?: "todos_variance_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "todos" */
export type TodosVarianceOrderBy = {
  id?: Maybe<OrderBy>;
};

export type TodosQueryVariables = Exact<{ [key: string]: never }>;

export type TodosQuery = { __typename?: "query_root" } & {
  todos: Array<
    { __typename?: "todos" } & Pick<Todos, "id" | "name" | "complete">
  >;
};

export type CreateTodoMutationVariables = Exact<{
  name: Scalars["String"];
}>;

export type CreateTodoMutation = { __typename?: "mutation_root" } & {
  insert_todos?: Maybe<
    { __typename?: "todos_mutation_response" } & {
      returning: Array<
        { __typename?: "todos" } & Pick<Todos, "id" | "name" | "complete">
      >;
    }
  >;
};

export type UpdateTodoMutationVariables = Exact<{
  id: Scalars["Int"];
  complete: Scalars["Boolean"];
}>;

export type UpdateTodoMutation = { __typename?: "mutation_root" } & {
  update_todos?: Maybe<
    { __typename?: "todos_mutation_response" } & {
      returning: Array<
        { __typename?: "todos" } & Pick<Todos, "id" | "name" | "complete">
      >;
    }
  >;
};

export type DeleteTodoMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeleteTodoMutation = { __typename?: "mutation_root" } & {
  delete_todos?: Maybe<
    { __typename?: "todos_mutation_response" } & {
      returning: Array<{ __typename?: "todos" } & Pick<Todos, "id">>;
    }
  >;
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
  baseOptions?: Apollo.QueryHookOptions<TodosQuery, TodosQueryVariables>
) {
  return Apollo.useQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    baseOptions
  );
}
export function useTodosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TodosQuery, TodosQueryVariables>
) {
  return Apollo.useLazyQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    baseOptions
  );
}
export type TodosQueryHookResult = ReturnType<typeof useTodosQuery>;
export type TodosLazyQueryHookResult = ReturnType<typeof useTodosLazyQuery>;
export type TodosQueryResult = Apollo.QueryResult<
  TodosQuery,
  TodosQueryVariables
>;
export const CreateTodoDocument = gql`
  mutation CreateTodo($name: String!) {
    insert_todos(objects: { name: $name }) {
      returning {
        id
        name
        complete
      }
    }
  }
`;
export type CreateTodoMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >
) {
  return Apollo.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(
    CreateTodoDocument,
    baseOptions
  );
}
export type CreateTodoMutationHookResult = ReturnType<
  typeof useCreateTodoMutation
>;
export type CreateTodoMutationResult = Apollo.MutationResult<
  CreateTodoMutation
>;
export type CreateTodoMutationOptions = Apollo.BaseMutationOptions<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;
export const UpdateTodoDocument = gql`
  mutation UpdateTodo($id: Int!, $complete: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { complete: $complete }) {
      returning {
        id
        name
        complete
      }
    }
  }
`;
export type UpdateTodoMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTodoMutation,
    UpdateTodoMutationVariables
  >
) {
  return Apollo.useMutation<UpdateTodoMutation, UpdateTodoMutationVariables>(
    UpdateTodoDocument,
    baseOptions
  );
}
export type UpdateTodoMutationHookResult = ReturnType<
  typeof useUpdateTodoMutation
>;
export type UpdateTodoMutationResult = Apollo.MutationResult<
  UpdateTodoMutation
>;
export type UpdateTodoMutationOptions = Apollo.BaseMutationOptions<
  UpdateTodoMutation,
  UpdateTodoMutationVariables
>;
export const DeleteTodoDocument = gql`
  mutation DeleteTodo($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
export type DeleteTodoMutationFn = Apollo.MutationFunction<
  DeleteTodoMutation,
  DeleteTodoMutationVariables
>;

/**
 * __useDeleteTodoMutation__
 *
 * To run a mutation, you first call `useDeleteTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTodoMutation, { data, loading, error }] = useDeleteTodoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTodoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTodoMutation,
    DeleteTodoMutationVariables
  >
) {
  return Apollo.useMutation<DeleteTodoMutation, DeleteTodoMutationVariables>(
    DeleteTodoDocument,
    baseOptions
  );
}
export type DeleteTodoMutationHookResult = ReturnType<
  typeof useDeleteTodoMutation
>;
export type DeleteTodoMutationResult = Apollo.MutationResult<
  DeleteTodoMutation
>;
export type DeleteTodoMutationOptions = Apollo.BaseMutationOptions<
  DeleteTodoMutation,
  DeleteTodoMutationVariables
>;
