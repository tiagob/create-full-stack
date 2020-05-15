import {
  useDestroyTodoMutation,
  TodosQuery,
  TodosQueryVariables,
  TodosDocument
} from "./generated/graphql";

export default () =>
  useDestroyTodoMutation({
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const destroyTodo = data.destroyTodo;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: {
            todos: todos.filter(todo => todo.id !== destroyTodo.id)
          }
        });
      }
    }
  });
