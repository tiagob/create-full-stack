import {
  Todo,
  TodosDocument,
  TodosQuery,
  TodosQueryVariables,
  useDestroyTodoMutation,
} from "./__generated__";

export default () =>
  useDestroyTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.destroyTodo) {
        return;
      }
      const { destroyTodo } = data;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
      });
      const todos = query?.todos || [];
      cache.writeQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument,
        data: {
          todos: todos.filter((todo: Todo) => todo.id !== destroyTodo.id),
        },
      });
    },
  });
