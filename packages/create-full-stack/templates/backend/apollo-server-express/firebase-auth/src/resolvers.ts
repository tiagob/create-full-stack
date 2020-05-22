import {
  MutationDestroyTodoArgs,
  MutationUpdateTodoArgs,
  Resolvers,
} from "./graphql/__generated__";
import { Todo } from "./models";
import admin from "./utils/firebaseAdmin";

interface Context {
  user: admin.auth.UserRecord;
}

const resolver: Resolvers = {
  Query: {
    todos: (_, __, context: Context) =>
      Todo.findAll({ where: { uid: context.user.uid } }),
  },
  Mutation: {
    createTodo: (_, args, context: Context) =>
      Todo.create({ uid: context.user.uid, complete: false, ...args }),
    updateTodo: async (
      _,
      { id, ...args }: MutationUpdateTodoArgs,
      context: Context
    ) => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.uid } });
      if (todo) {
        return todo.update(args);
      }
      return undefined;
    },
    destroyTodo: async (
      _,
      { id }: MutationDestroyTodoArgs,
      context: Context
    ) => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.uid } });
      if (todo) {
        return todo.destroy();
      }
      return undefined;
    },
  },
};
export default resolver;
