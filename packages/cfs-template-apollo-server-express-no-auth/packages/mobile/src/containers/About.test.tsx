import { render } from "@testing-library/react-native";
import React from "react";

import { navigation } from "../utils/testMocks";
import About from "./About";

it("renders github link", () => {
  const { getByText } = render(<About navigation={navigation} />);
  const link = getByText(/go to github/i);
  expect(link).toBeTruthy();
});
