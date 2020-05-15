import {
  useUpdateTodoMutation,
  TodosQuery,
  TodosQueryVariables,
  TodosDocument
} from "./generated/graphql";

export default () =>
  useUpdateTodoMutation({
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const updateTodo = data.updateTodo;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: {
            todos: todos.map(todo =>
              todo.id === updateTodo.id ? updateTodo : todo
            )
          }
        });
      }
    }
  });
