import { useDeleteTodoMutation } from "./__generated__";

export default () =>
  useDeleteTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.delete_todos) {
        return;
      }
      const deleteTodo = data.delete_todos.returning[0];
      cache.evict({ id: cache.identify(deleteTodo) });
    },
  });
