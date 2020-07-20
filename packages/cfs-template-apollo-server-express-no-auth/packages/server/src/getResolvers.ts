import { Connection } from "typeorm";

import { Todo } from "./entity/Todo";
import {
  MutationCreateTodoArgs,
  MutationDeleteTodoArgs,
  MutationUpdateTodoArgs,
  Resolvers,
} from "./graphql/__generated__";

export default function getResolover(connection: Connection): Resolvers {
  const todoRepository = connection.getRepository(Todo);
  return {
    Query: {
      todos: () => todoRepository.find(),
    },
    Mutation: {
      createTodo: (_, args: MutationCreateTodoArgs) =>
        todoRepository.save({ complete: false, ...args }),
      updateTodo: async (_, { id, ...args }: MutationUpdateTodoArgs) => {
        await todoRepository.update(id, args);
        return todoRepository.findOne(id);
      },
      deleteTodo: async (_, { id }: MutationDeleteTodoArgs) => {
        const todo = todoRepository.findOne(id);
        await todoRepository.delete(id);
        return todo;
      },
    },
  };
}
