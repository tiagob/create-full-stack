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
      const todos = query?.todos || [];
      cache.writeQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
        data: { todos: todos.concat(createTodo) },
      });
    },
  });
