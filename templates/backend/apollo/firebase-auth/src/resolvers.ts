import { Todo } from "./models";
import {
  MutationCreateTodoArgs,
  MutationUpdateTodoArgs,
  MutationDestroyTodoArgs
} from "./generated/graphql";
import admin from "./utils/firebaseAdmin";

interface Context {
  user: admin.auth.UserRecord;
}

export default {
  Query: {
    todos: (_: any, __: any, context: Context) =>
      Todo.findAll({ where: { uid: context.user.uid } })
  },
  Mutation: {
    createTodo: (_: any, args: MutationCreateTodoArgs, context: Context) =>
      Todo.create({ uid: context.user.uid, complete: false, ...args }),
    updateTodo: async (
      _: any,
      { id, ...args }: MutationUpdateTodoArgs,
      context: Context
    ) => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.uid } });
      if (todo) {
        return todo.update(args);
      } else {
        return null;
      }
    },
    destroyTodo: async (
      _: any,
      { id }: MutationDestroyTodoArgs,
      context: Context
    ) => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.uid } });
      if (todo) {
        return todo.destroy();
      } else {
        return null;
      }
    }
  }
};
