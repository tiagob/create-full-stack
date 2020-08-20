import { render } from "@testing-library/react";
import React from "react";

import App from "./App";

it("renders header", () => {
  const { getByLabelText } = render(<App />);
  const header = getByLabelText(/menu/i);
  expect(header).toBeInTheDocument();
});
