import useCreateTodoMutation from "./useCreateTodoMutation";
import useDestroyTodoMutation from "./useDestroyTodoMutation";
import useUpdateTodoMutation from "./useUpdateTodoMutation";

export * from "./generated/graphql";

// Override mutation hooks to handle the apollo cache
export { useCreateTodoMutation, useDestroyTodoMutation, useUpdateTodoMutation };
