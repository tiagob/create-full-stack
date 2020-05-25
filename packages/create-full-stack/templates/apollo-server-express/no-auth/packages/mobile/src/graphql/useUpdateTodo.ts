import {
  Todo,
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useUpdateTodoMutation,
} from "./__generated__";

export default () =>
  useUpdateTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.updateTodo) {
        return;
      }
      const { updateTodo } = data;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      const todos = query?.todos || [];
      cache.writeQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
        data: {
          todos: todos.map((todo: Todo) =>
            todo.id === updateTodo.id ? updateTodo : todo
          ),
        },
      });
    },
  });
