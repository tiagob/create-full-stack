import {
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useDestroyTodoMutation,
} from "./__generated__";

export default () =>
  useDestroyTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.delete_todos) {
        return;
      }
      const destroyTodo = data.delete_todos.returning[0];
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: {
            todos: todos.filter((todo) => todo.id !== destroyTodo.id),
          },
        });
      }
    },
  });
