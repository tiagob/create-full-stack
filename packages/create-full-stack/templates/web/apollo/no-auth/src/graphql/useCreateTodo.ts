import {
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useCreateTodoMutation,
} from "./__generated__";

export default () =>
  useCreateTodoMutation({
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const { createTodo } = data;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      const todos = query?.todos || [];
      cache.writeQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
        data: { todos: todos.concat([createTodo]) },
      });
    },
  });
