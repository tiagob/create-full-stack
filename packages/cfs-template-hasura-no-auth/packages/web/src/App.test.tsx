import { render } from "@testing-library/react";
import React from "react";

import App from "./App";

it("renders header", () => {
  const { getByText } = render(<App />);
  const header = getByText(/todos/i);
  expect(header).toBeInTheDocument();
});
