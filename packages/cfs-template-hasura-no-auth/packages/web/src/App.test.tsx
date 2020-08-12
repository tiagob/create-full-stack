import { render } from "@testing-library/react";
import React from "react";

import App from "./App";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({ getAccessTokenSilently: jest.fn() }),
  isLoading: false,
  isAuthenticated: true,
}));

it("renders header", () => {
  const { getByText } = render(<App />);
  const header = getByText(/todos/i);
  expect(header).toBeInTheDocument();
});
