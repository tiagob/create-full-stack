import {
  MutationCreateTodoArgs,
  MutationDestroyTodoArgs,
  MutationUpdateTodoArgs,
  Resolvers,
} from "./graphql/__generated__";
import { Todo } from "./models";

const resolver: Resolvers = {
  Query: {
    todos: () => Todo.findAll({}),
  },
  Mutation: {
    createTodo: (_, args: MutationCreateTodoArgs) =>
      Todo.create({ complete: false, ...args }),
    updateTodo: async (_, { id, ...args }: MutationUpdateTodoArgs) => {
      const todo = await Todo.findOne({ where: { id } });
      if (todo) {
        return todo.update(args);
      }
      return undefined;
    },
    destroyTodo: async (_, { id }: MutationDestroyTodoArgs) => {
      const todo = await Todo.findOne({ where: { id } });
      if (todo) {
        return todo.destroy();
      }
      return undefined;
    },
  },
};
export default resolver;
