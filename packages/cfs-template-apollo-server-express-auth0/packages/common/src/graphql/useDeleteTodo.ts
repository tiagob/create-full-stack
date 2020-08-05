import { useDeleteTodoMutation } from "./__generated__";

export default () =>
  useDeleteTodoMutation({
    update: (cache, { data }) => {
      if (!data || !data.deleteTodo) {
        return;
      }
      const { deleteTodo } = data;
      cache.evict({ id: cache.identify(deleteTodo) });
    },
  });
