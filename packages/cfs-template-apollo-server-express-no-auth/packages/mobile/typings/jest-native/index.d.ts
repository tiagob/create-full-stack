// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactTestInstance } from "react-test-renderer";

// Adapted from
// https://github.com/testing-library/jest-native/issues/21#issuecomment-618089793

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeDisabled(): R;
      toContainElement(element: ReactTestInstance | null): R;
      toBeEmpty(): R;
      toHaveProp(
        attr: string,
        value?: string | number | boolean | undefined | null | object
      ): R;
      toHaveTextContent(
        text: string | RegExp,
        options?: { normalizeWhitespace: boolean }
      ): R;
      toBeEnabled(): R;
      toHaveStyle(style: object[] | object): R;
    }
  }
}
