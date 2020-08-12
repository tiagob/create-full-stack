import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import {
  CreateTodoDocument,
  DeleteTodoDocument,
  TodosDocument,
  UpdateTodoDocument,
} from "common";
import { createConnection, getConnection, Repository } from "typeorm";

import { Todo } from "./entity/Todo";
import getResolvers from "./getResolvers";
import typeDefs from "./graphql/schema";

let server: ApolloServer;
let todoRepository: Repository<Todo>;

beforeEach(async () => {
  const connection = await createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [Todo],
    synchronize: true,
    logging: false,
  });
  const resolvers = getResolvers(connection);
  server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ user: { sub: "1" } }),
  });
  todoRepository = connection.getRepository(Todo);
});

afterEach(() => {
  const conn = getConnection();
  return conn.close();
});

it("fetches empty todos", async () => {
  const { query } = createTestClient(server);
  const result = await query({ query: TodosDocument });
  expect(result).toMatchSnapshot();
});

it("fetches todos", async () => {
  await todoRepository.save({
    name: "This test",
    uid: "1",
    complete: false,
  });
  const { query } = createTestClient(server);
  const result = await query({ query: TodosDocument });
  expect(result).toMatchSnapshot();
});

it("creates a todo", async () => {
  const { mutate } = createTestClient(server);
  const result = await mutate({
    mutation: CreateTodoDocument,
    variables: { name: "This test" },
  });
  expect(result).toMatchSnapshot();
});

it("updates a todo", async () => {
  const todo = await todoRepository.save({
    name: "This test",
    uid: "1",
    complete: false,
  });
  const { mutate } = createTestClient(server);
  const result = await mutate({
    mutation: UpdateTodoDocument,
    variables: { id: todo.id, complete: true },
  });
  expect(result).toMatchSnapshot();
});

it("deletes a todo", async () => {
  const todo = await todoRepository.save({
    name: "This test",
    uid: "1",
    complete: false,
  });
  const { mutate } = createTestClient(server);
  const result = await mutate({
    mutation: DeleteTodoDocument,
    variables: { id: todo.id },
  });
  expect(result).toMatchSnapshot();
});
