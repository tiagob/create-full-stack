import {
  Todo,
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useDeleteTodoMutation,
} from "./__generated__";

export default () =>
  useDeleteTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.deleteTodo) {
        return;
      }
      const { deleteTodo } = data;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      const todos = query?.todos || [];
      cache.writeQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
        data: {
          todos: todos.filter((todo: Todo) => todo.id !== deleteTodo.id),
        },
      });
    },
  });
