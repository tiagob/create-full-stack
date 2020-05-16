import gql from "graphql-tag";
import * as ReactApollo from "react-apollo";
import * as React from "react";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Maybe<T> = T | null;

export const CreateTodoDocument = gql`
  mutation CreateTodo($name: String!) {
    insert_todos(objects: { name: $name }) {
      returning {
        name
        id
        complete
      }
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
    update_todos(where: { id: { _eq: $id } }, _set: { complete: $complete }) {
      returning {
        complete
        id
        name
      }
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
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        id
      }
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

export type CreateTodoMutation = { __typename?: "mutation_root" } & {
  insert_todos: Maybe<
    { __typename?: "todos_mutation_response" } & {
      returning: Array<
        { __typename?: "todos" } & Pick<Todos, "name" | "id" | "complete">
      >;
    }
  >;
};

export type UpdateTodoMutationVariables = {
  id: Scalars["Int"];
  complete: Scalars["Boolean"];
};

export type UpdateTodoMutation = { __typename?: "mutation_root" } & {
  update_todos: Maybe<
    { __typename?: "todos_mutation_response" } & {
      returning: Array<
        { __typename?: "todos" } & Pick<Todos, "complete" | "id" | "name">
      >;
    }
  >;
};

export type DestroyTodoMutationVariables = {
  id: Scalars["Int"];
};

export type DestroyTodoMutation = { __typename?: "mutation_root" } & {
  delete_todos: Maybe<
    { __typename?: "todos_mutation_response" } & {
      returning: Array<{ __typename?: "todos" } & Pick<Todos, "id">>;
    }
  >;
};

export type TodosQueryVariables = {};

export type TodosQuery = { __typename?: "query_root" } & {
  todos: Array<
    { __typename?: "todos" } & Pick<Todos, "id" | "name" | "complete">
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

/** expression to compare columns of type boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: Maybe<Scalars["Boolean"]>;
  _gt?: Maybe<Scalars["Boolean"]>;
  _gte?: Maybe<Scalars["Boolean"]>;
  _in?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _lt?: Maybe<Scalars["Boolean"]>;
  _lte?: Maybe<Scalars["Boolean"]>;
  _neq?: Maybe<Scalars["Boolean"]>;
  _nin?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
};

/** conflict action */
export enum Conflict_Action {
  /** ignore the insert on this row */
  Ignore = "ignore",
  /** update the row with the given values */
  Update = "update"
}

/** expression to compare columns of type integer. All fields are combined with logical 'AND'. */
export type Integer_Comparison_Exp = {
  _eq?: Maybe<Scalars["Int"]>;
  _gt?: Maybe<Scalars["Int"]>;
  _gte?: Maybe<Scalars["Int"]>;
  _in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _lt?: Maybe<Scalars["Int"]>;
  _lte?: Maybe<Scalars["Int"]>;
  _neq?: Maybe<Scalars["Int"]>;
  _nin?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  /** delete data from the table: "todos" */
  delete_todos?: Maybe<Todos_Mutation_Response>;
  /** insert data into the table: "todos" */
  insert_todos?: Maybe<Todos_Mutation_Response>;
  /** update data of the table: "todos" */
  update_todos?: Maybe<Todos_Mutation_Response>;
};

/** mutation root */
export type Mutation_RootDelete_TodosArgs = {
  where: Todos_Bool_Exp;
};

/** mutation root */
export type Mutation_RootInsert_TodosArgs = {
  objects: Array<Todos_Insert_Input>;
  on_conflict?: Maybe<Todos_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_TodosArgs = {
  _inc?: Maybe<Todos_Inc_Input>;
  _set?: Maybe<Todos_Set_Input>;
  where: Todos_Bool_Exp;
};

/** column ordering options */
export enum Order_By {
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
  DescNullsLast = "desc_nulls_last"
}

/** query root */
export type Query_Root = {
  __typename?: "query_root";
  /** fetch data from the table: "todos" */
  todos: Array<Todos>;
  /** fetch aggregated fields from the table: "todos" */
  todos_aggregate: Todos_Aggregate;
  /** fetch data from the table: "todos" using primary key columns */
  todos_by_pk?: Maybe<Todos>;
};

/** query root */
export type Query_RootTodosArgs = {
  distinct_on?: Maybe<Array<Todos_Select_Column>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<Todos_Order_By>>;
  where?: Maybe<Todos_Bool_Exp>;
};

/** query root */
export type Query_RootTodos_AggregateArgs = {
  distinct_on?: Maybe<Array<Todos_Select_Column>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<Todos_Order_By>>;
  where?: Maybe<Todos_Bool_Exp>;
};

/** query root */
export type Query_RootTodos_By_PkArgs = {
  id: Scalars["Int"];
};

/** subscription root */
export type Subscription_Root = {
  __typename?: "subscription_root";
  /** fetch data from the table: "todos" */
  todos: Array<Todos>;
  /** fetch aggregated fields from the table: "todos" */
  todos_aggregate: Todos_Aggregate;
  /** fetch data from the table: "todos" using primary key columns */
  todos_by_pk?: Maybe<Todos>;
};

/** subscription root */
export type Subscription_RootTodosArgs = {
  distinct_on?: Maybe<Array<Todos_Select_Column>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<Todos_Order_By>>;
  where?: Maybe<Todos_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootTodos_AggregateArgs = {
  distinct_on?: Maybe<Array<Todos_Select_Column>>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  order_by?: Maybe<Array<Todos_Order_By>>;
  where?: Maybe<Todos_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootTodos_By_PkArgs = {
  id: Scalars["Int"];
};

/** expression to compare columns of type text. All fields are combined with logical 'AND'. */
export type Text_Comparison_Exp = {
  _eq?: Maybe<Scalars["String"]>;
  _gt?: Maybe<Scalars["String"]>;
  _gte?: Maybe<Scalars["String"]>;
  _ilike?: Maybe<Scalars["String"]>;
  _in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _like?: Maybe<Scalars["String"]>;
  _lt?: Maybe<Scalars["String"]>;
  _lte?: Maybe<Scalars["String"]>;
  _neq?: Maybe<Scalars["String"]>;
  _nilike?: Maybe<Scalars["String"]>;
  _nin?: Maybe<Array<Maybe<Scalars["String"]>>>;
  _nlike?: Maybe<Scalars["String"]>;
  _nsimilar?: Maybe<Scalars["String"]>;
  _similar?: Maybe<Scalars["String"]>;
};

/** columns and relationships of "todos" */
export type Todos = {
  __typename?: "todos";
  complete: Scalars["Boolean"];
  id: Scalars["Int"];
  name: Scalars["String"];
  uid: Scalars["String"];
};

/** aggregated selection of "todos" */
export type Todos_Aggregate = {
  __typename?: "todos_aggregate";
  aggregate?: Maybe<Todos_Aggregate_Fields>;
  nodes: Array<Todos>;
};

/** aggregate fields of "todos" */
export type Todos_Aggregate_Fields = {
  __typename?: "todos_aggregate_fields";
  avg?: Maybe<Todos_Avg_Fields>;
  count?: Maybe<Scalars["Int"]>;
  max?: Maybe<Todos_Max_Fields>;
  min?: Maybe<Todos_Min_Fields>;
  stddev?: Maybe<Todos_Stddev_Fields>;
  stddev_pop?: Maybe<Todos_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Todos_Stddev_Samp_Fields>;
  sum?: Maybe<Todos_Sum_Fields>;
  var_pop?: Maybe<Todos_Var_Pop_Fields>;
  var_samp?: Maybe<Todos_Var_Samp_Fields>;
  variance?: Maybe<Todos_Variance_Fields>;
};

/** aggregate fields of "todos" */
export type Todos_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Todos_Select_Column>>;
  distinct?: Maybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "todos" */
export type Todos_Aggregate_Order_By = {
  avg?: Maybe<Todos_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Todos_Max_Order_By>;
  min?: Maybe<Todos_Min_Order_By>;
  stddev?: Maybe<Todos_Stddev_Order_By>;
  stddev_pop?: Maybe<Todos_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Todos_Stddev_Samp_Order_By>;
  sum?: Maybe<Todos_Sum_Order_By>;
  var_pop?: Maybe<Todos_Var_Pop_Order_By>;
  var_samp?: Maybe<Todos_Var_Samp_Order_By>;
  variance?: Maybe<Todos_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "todos" */
export type Todos_Arr_Rel_Insert_Input = {
  data: Array<Todos_Insert_Input>;
  on_conflict?: Maybe<Todos_On_Conflict>;
};

/** aggregate avg on columns */
export type Todos_Avg_Fields = {
  __typename?: "todos_avg_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "todos" */
export type Todos_Avg_Order_By = {
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "todos". All fields are combined with a logical 'AND'. */
export type Todos_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Todos_Bool_Exp>>>;
  _not?: Maybe<Todos_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Todos_Bool_Exp>>>;
  complete?: Maybe<Boolean_Comparison_Exp>;
  id?: Maybe<Integer_Comparison_Exp>;
  name?: Maybe<Text_Comparison_Exp>;
  uid?: Maybe<Varchar_Comparison_Exp>;
};

/** unique or primary key constraints on table "todos" */
export enum Todos_Constraint {
  /** unique or primary key constraint */
  TodosPkey = "todos_pkey"
}

/** input type for incrementing integer columne in table "todos" */
export type Todos_Inc_Input = {
  id?: Maybe<Scalars["Int"]>;
};

/** input type for inserting data into table "todos" */
export type Todos_Insert_Input = {
  complete?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** aggregate max on columns */
export type Todos_Max_Fields = {
  __typename?: "todos_max_fields";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** order by max() on columns of table "todos" */
export type Todos_Max_Order_By = {
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  uid?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Todos_Min_Fields = {
  __typename?: "todos_min_fields";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** order by min() on columns of table "todos" */
export type Todos_Min_Order_By = {
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  uid?: Maybe<Order_By>;
};

/** response of any mutation on the table "todos" */
export type Todos_Mutation_Response = {
  __typename?: "todos_mutation_response";
  /** number of affected rows by the mutation */
  affected_rows: Scalars["Int"];
  /** data of the affected rows by the mutation */
  returning: Array<Todos>;
};

/** input type for inserting object relation for remote table "todos" */
export type Todos_Obj_Rel_Insert_Input = {
  data: Todos_Insert_Input;
  on_conflict?: Maybe<Todos_On_Conflict>;
};

/** on conflict condition type for table "todos" */
export type Todos_On_Conflict = {
  constraint: Todos_Constraint;
  update_columns: Array<Todos_Update_Column>;
};

/** ordering options when selecting data from "todos" */
export type Todos_Order_By = {
  complete?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  uid?: Maybe<Order_By>;
};

/** select columns of table "todos" */
export enum Todos_Select_Column {
  /** column name */
  Complete = "complete",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Uid = "uid"
}

/** input type for updating data in table "todos" */
export type Todos_Set_Input = {
  complete?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["String"]>;
};

/** aggregate stddev on columns */
export type Todos_Stddev_Fields = {
  __typename?: "todos_stddev_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "todos" */
export type Todos_Stddev_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Todos_Stddev_Pop_Fields = {
  __typename?: "todos_stddev_pop_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "todos" */
export type Todos_Stddev_Pop_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Todos_Stddev_Samp_Fields = {
  __typename?: "todos_stddev_samp_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "todos" */
export type Todos_Stddev_Samp_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Todos_Sum_Fields = {
  __typename?: "todos_sum_fields";
  id?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "todos" */
export type Todos_Sum_Order_By = {
  id?: Maybe<Order_By>;
};

/** update columns of table "todos" */
export enum Todos_Update_Column {
  /** column name */
  Complete = "complete",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Uid = "uid"
}

/** aggregate var_pop on columns */
export type Todos_Var_Pop_Fields = {
  __typename?: "todos_var_pop_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "todos" */
export type Todos_Var_Pop_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Todos_Var_Samp_Fields = {
  __typename?: "todos_var_samp_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "todos" */
export type Todos_Var_Samp_Order_By = {
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Todos_Variance_Fields = {
  __typename?: "todos_variance_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "todos" */
export type Todos_Variance_Order_By = {
  id?: Maybe<Order_By>;
};

/** expression to compare columns of type varchar. All fields are combined with logical 'AND'. */
export type Varchar_Comparison_Exp = {
  _eq?: Maybe<Scalars["String"]>;
  _gt?: Maybe<Scalars["String"]>;
  _gte?: Maybe<Scalars["String"]>;
  _ilike?: Maybe<Scalars["String"]>;
  _in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  _is_null?: Maybe<Scalars["Boolean"]>;
  _like?: Maybe<Scalars["String"]>;
  _lt?: Maybe<Scalars["String"]>;
  _lte?: Maybe<Scalars["String"]>;
  _neq?: Maybe<Scalars["String"]>;
  _nilike?: Maybe<Scalars["String"]>;
  _nin?: Maybe<Array<Maybe<Scalars["String"]>>>;
  _nlike?: Maybe<Scalars["String"]>;
  _nsimilar?: Maybe<Scalars["String"]>;
  _similar?: Maybe<Scalars["String"]>;
};
