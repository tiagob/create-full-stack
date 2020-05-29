import {
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useCreateTodoMutation,
} from "./__generated__";

export default () =>
  useCreateTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.insert_todos) {
        return;
      }
      const createTodo = data.insert_todos.returning;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: { todos: todos.concat(createTodo) },
        });
      }
    },
  });
