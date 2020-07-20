import { Connection } from "typeorm";

import { Todo } from "./entity/Todo";
import {
  MutationDeleteTodoArgs,
  MutationUpdateTodoArgs,
  Resolvers,
} from "./graphql/__generated__";

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

export default function getResolover(connection: Connection): Resolvers {
  const todoRepository = connection.getRepository(Todo);
  return {
    Query: {
      todos: (_, __, context: Context) =>
        todoRepository.find({ uid: context.user.sub }),
    },
    Mutation: {
      createTodo: (_, args, context: Context) =>
        todoRepository.save({
          uid: context.user.sub,
          complete: false,
          ...args,
        }),
      updateTodo: async (
        _,
        { id, ...args }: MutationUpdateTodoArgs,
        context: Context
      ) => {
        await todoRepository.update({ id, uid: context.user.sub }, args);
        return todoRepository.findOne(id);
      },
      deleteTodo: async (
        _,
        { id }: MutationDeleteTodoArgs,
        context: Context
      ) => {
        const todo = todoRepository.findOne({ id, uid: context.user.sub });
        await todoRepository.delete(id);
        return todo;
      },
    },
  };
}
