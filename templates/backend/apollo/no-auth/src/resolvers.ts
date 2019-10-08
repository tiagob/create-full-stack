import { Todo } from "./models";
import {
  MutationCreateTodoArgs,
  MutationUpdateTodoArgs,
  MutationDestroyTodoArgs
} from "./generated/graphql";

export default {
  Query: {
    todos: () => Todo.findAll({})
  },
  Mutation: {
    createTodo: (_: any, args: MutationCreateTodoArgs) =>
      Todo.create({ complete: false, ...args }),
    updateTodo: async (_: any, { id, ...args }: MutationUpdateTodoArgs) => {
      const todo = await Todo.findOne({ where: { id } });
      if (todo) {
        return todo.update(args);
      } else {
        return null;
      }
    },
    destroyTodo: async (_: any, { id }: MutationDestroyTodoArgs) => {
      const todo = await Todo.findOne({ where: { id } });
      if (todo) {
        return todo.destroy();
      } else {
        return null;
      }
    }
  }
};
