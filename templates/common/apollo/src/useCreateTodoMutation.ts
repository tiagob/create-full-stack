import {
  useCreateTodoMutation,
  TodosQuery,
  TodosQueryVariables,
  TodosDocument
} from "./generated/graphql";

export default () =>
  useCreateTodoMutation({
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const createTodo = data.createTodo;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: { todos: todos.concat([createTodo]) }
        });
      }
    }
  });
