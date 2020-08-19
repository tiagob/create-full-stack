import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render } from "@testing-library/react-native";
import {
  CreateTodoDocument,
  DeleteTodoDocument,
  TodosDocument,
  UpdateTodoDocument,
} from "common";
import React from "react";
import { act } from "react-test-renderer";

import { navigation } from "../utils/testMocks";
import Todos from "./Todos";

it("renders an input", () => {
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
      <Todos navigation={navigation} />
    </MockedProvider>
  );

  expect(getByPlaceholderText("What needs to be done?")).toBeTruthy();
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
      <Todos navigation={navigation} />
    </MockedProvider>
  );

  const todo = await findByText(name);
  expect(todo).toBeTruthy();
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
  const {
    queryByText,
    getByText,
    findByPlaceholderText,
    getByA11yLabel,
  } = render(
    <MockedProvider mocks={mocks}>
      <Todos navigation={navigation} />
    </MockedProvider>
  );
  expect(queryByText(name)).toBeNull();

  const input = await findByPlaceholderText("What needs to be done?");
  const submitButton = getByA11yLabel(/submit/i);
  expect(input).toBeTruthy();
  expect(submitButton).toBeTruthy();
  fireEvent.changeText(input, name);
  expect(input?.props.value).toBe(name);

  await act(async () => {
    fireEvent.press(submitButton);
  });
  const todo = getByText(name);
  expect(input?.props.value).toBe("");
  expect(todo).toBeTruthy();
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
  const { findByText, getByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos navigation={navigation} />
    </MockedProvider>
  );

  const todo = await findByText(name);
  expect(todo).toBeTruthy();

  await act(async () => {
    fireEvent.press(todo);
  });
  expect(getByText(name)).toHaveStyle({ textDecorationLine: "line-through" });
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
  const { findByA11yLabel, queryByText } = render(
    <MockedProvider mocks={mocks}>
      <Todos navigation={navigation} />
    </MockedProvider>
  );

  const button = await findByA11yLabel(/delete/i);
  expect(button).toBeTruthy();

  await act(async () => {
    fireEvent.press(button);
  });
  expect(queryByText(name)).toBeNull();
});
