import {
  MutationCreateTodoArgs,
  MutationDestroyTodoArgs,
  MutationUpdateTodoArgs,
} from "./generated/graphql";
import { Todo } from "./models";

export default {
  Query: {
    todos: (): Promise<Todo[]> => Todo.findAll({}),
  },
  Mutation: {
    createTodo: (_: unknown, args: MutationCreateTodoArgs): Promise<Todo> =>
      Todo.create({ complete: false, ...args }),
    updateTodo: async (
      _: unknown,
      { id, ...args }: MutationUpdateTodoArgs
    ): Promise<Todo | undefined> => {
      const todo = await Todo.findOne({ where: { id } });
      if (todo) {
        return todo.update(args);
      }
      return undefined;
    },
    destroyTodo: async (
      _: unknown,
      { id }: MutationDestroyTodoArgs
    ): Promise<Todo | undefined> => {
      const todo = await Todo.findOne({ where: { id } });
      if (todo) {
        return todo.destroy();
      }
      return undefined;
    },
  },
};
