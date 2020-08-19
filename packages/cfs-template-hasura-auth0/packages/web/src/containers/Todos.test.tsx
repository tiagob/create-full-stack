import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, wait } from "@testing-library/react";
import {
  CreateTodoDocument,
  DeleteTodoDocument,
  TodosDocument,
  UpdateTodoDocument,
} from "common";
import React from "react";

import Todos from "./Todos";

it("renders an input", async () => {
  const mocks = [
    {
      request: {
        query: TodosDocument,
      },
      result: {
        data: {
          todos: [],
        },
      },
    },
  ];
  const { getByPlaceholderText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  await wait();
  expect(getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
});

it("renders a todo", async () => {
  const name = "This test";
  const mocks = [
    {
      request: {
        query: TodosDocument,
      },
      result: {
        data: {
          todos: [{ __typename: "todos", id: 1, name, complete: false }],
        },
      },
    },
  ];
  const { getByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  await wait();
  expect(getByText(name)).toBeInTheDocument();
});

it("creates a todo", async () => {
  const name = "This test";
  const mocks = [
    {
      request: {
        query: TodosDocument,
      },
      result: {
        data: {
          todos: [],
        },
      },
    },
    {
      request: {
        query: CreateTodoDocument,
        variables: { name },
      },
      result: {
        data: {
          insert_todos: {
            returning: { __typename: "todos", id: 1, name, complete: false },
          },
        },
      },
    },
  ];
  const { queryByText, getByText, getByPlaceholderText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  await wait();
  expect(queryByText(name)).toBeNull();
  const input = getByPlaceholderText(
    "What needs to be done?"
  ) as HTMLInputElement;
  expect(input).toBeInTheDocument();
  fireEvent.change(input, { target: { value: name } });

  await wait();
  expect(input.value).toBe(name);
  fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });

  await wait();
  expect(input.value).toBe("");
  const todo = getByText(name);
  expect(todo).toBeInTheDocument();
});

it("updates a todo", async () => {
  const name = "This test";
  const mocks = [
    {
      request: {
        query: TodosDocument,
      },
      result: {
        data: {
          todos: [{ __typename: "todos", id: 1, name, complete: false }],
        },
      },
    },
    {
      request: {
        query: UpdateTodoDocument,
        variables: { id: 1, complete: true },
      },
      result: {
        data: {
          update_todos: {
            returning: [{ __typename: "todos", id: 1, name, complete: true }],
          },
        },
      },
    },
  ];
  const { getByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  await wait();
  const todo = getByText(name);
  expect(todo).toBeInTheDocument();
  fireEvent.click(todo);

  await wait();
  expect(getByText(name)).toHaveStyle("text-decoration: line-through;");
});

it("deletes a todo", async () => {
  const name = "This test";
  const mocks = [
    {
      request: {
        query: TodosDocument,
      },
      result: {
        data: {
          todos: [{ __typename: "todos", id: 1, name, complete: false }],
        },
      },
    },
    {
      request: {
        query: DeleteTodoDocument,
        variables: { id: 1 },
      },
      result: {
        data: { delete_todos: { returning: [{ __typename: "todos", id: 1 }] } },
      },
    },
  ];
  const { getByLabelText, queryByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  await wait();
  const button = getByLabelText(/delete/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);

  await wait();
  expect(queryByText(name)).toBeNull();
});
