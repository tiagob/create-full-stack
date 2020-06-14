import {
  MutationDestroyTodoArgs,
  MutationUpdateTodoArgs,
  Resolvers,
} from "./graphql/__generated__";
import { Todo } from "./models";

export interface DecodedJwt {
  aud: string[];
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  scope: string;
  sub: string;
}

interface Context {
  user: DecodedJwt;
}

const resolver: Resolvers = {
  Query: {
    todos: (_, __, context: Context) =>
      Todo.findAll({ where: { uid: context.user.sub } }),
  },
  Mutation: {
    createTodo: (_, args, context: Context) =>
      Todo.create({ uid: context.user.sub, complete: false, ...args }),
    updateTodo: async (
      _,
      { id, ...args }: MutationUpdateTodoArgs,
      context: Context
    ) => {
      const todo = await Todo.findOne({ where: { id, uid: context.user.sub } });
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
      const todo = await Todo.findOne({ where: { id, uid: context.user.sub } });
      if (todo) {
        await todo.destroy();
        return todo;
      }
      return undefined;
    },
  },
};
export default resolver;
