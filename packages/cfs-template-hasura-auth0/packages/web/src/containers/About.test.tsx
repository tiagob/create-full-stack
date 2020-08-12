import { render } from "@testing-library/react";
import React from "react";

import About from "./About";

it("renders github link", () => {
  const { getByText } = render(<About />);
  const link = getByText(/go to github/i);
  expect(link).toBeInTheDocument();
});
