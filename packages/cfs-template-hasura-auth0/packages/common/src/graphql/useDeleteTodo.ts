import {
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useDeleteTodoMutation,
} from "./__generated__";

export default () =>
  useDeleteTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.delete_todos) {
        return;
      }
      const deleteTodo = data.delete_todos.returning[0];
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: {
            todos: todos.filter((todo) => todo.id !== deleteTodo.id),
          },
        });
      }
    },
  });
