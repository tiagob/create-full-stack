import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, waitFor } from "@testing-library/react";
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
  const { findByPlaceholderText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  const input = await findByPlaceholderText("What needs to be done?");
  expect(input).toBeInTheDocument();
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
  const { findByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  const todo = await findByText(name);
  expect(todo).toBeInTheDocument();
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
  const { queryByText, findByText, getByPlaceholderText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  expect(queryByText(name)).toBeNull();
  const input = getByPlaceholderText(
    "What needs to be done?"
  ) as HTMLInputElement;
  expect(input).toBeInTheDocument();
  fireEvent.change(input, { target: { value: name } });

  await waitFor(() => expect(input.value).toBe(name));
  fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });

  const todo = await findByText(name);
  expect(input.value).toBe("");
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
  const { findByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  const todo = await findByText(name);
  expect(todo).toBeInTheDocument();
  fireEvent.click(todo);

  await waitFor(() =>
    expect(todo).toHaveStyle("text-decoration: line-through;")
  );
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
  const { findByLabelText, queryByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos />
    </MockedProvider>
  );

  const button = await findByLabelText(/delete/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);

  await waitFor(() => expect(queryByText(name)).toBeNull());
});
