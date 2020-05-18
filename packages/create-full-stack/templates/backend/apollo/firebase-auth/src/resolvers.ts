import {
  MutationCreateTodoArgs,
  MutationDestroyTodoArgs,
  MutationUpdateTodoArgs,
} from "./generated/graphql";
import { Todo } from "./models";
import admin from "./utils/firebaseAdmin";

interface Context {
  user: admin.auth.UserRecord;
}

export default {
  Query: {
    todos: (_: unknown, __: unknown, context: Context): Todo[] =>
      Todo.findAll({ where: { uid: context.user.uid } }),
  },
  Mutation: {
    createTodo: (
      _: unknown,
      arguments_: MutationCreateTodoArgs,
      context: Context
    ): Todo =>
      Todo.create({ uid: context.user.uid, complete: false, ...arguments_ }),
    updateTodo: async (
      _: unknown,
      { id, ...arguments_ }: MutationUpdateTodoArgs,
      context: Context
    ): Promise<Todo | undefined> => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.uid } });
      if (todo) {
        return todo.update(arguments_);
      }
      return undefined;
    },
    destroyTodo: async (
      _: unknown,
      { id }: MutationDestroyTodoArgs,
      context: Context
    ): Promise<Todo | undefined> => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.uid } });
      if (todo) {
        return todo.destroy();
      }
      return undefined;
    },
  },
};
