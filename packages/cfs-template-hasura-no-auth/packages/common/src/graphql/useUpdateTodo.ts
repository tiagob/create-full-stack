import {
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useUpdateTodoMutation,
} from "./__generated__";

export default () =>
  useUpdateTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.update_todos) {
        return;
      }
      const updateTodo = data.update_todos.returning[0];
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: {
            todos: todos.map((todo) =>
              todo.id === updateTodo.id ? updateTodo : todo
            ),
          },
        });
      }
    },
  });
