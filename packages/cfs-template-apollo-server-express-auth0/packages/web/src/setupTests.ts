// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// Fix "MutationObserver is not a constructor"
// https://github.com/testing-library/react-testing-library/issues/662
// Can likely remove with react-scripts v4
window.MutationObserver = require("mutation-observer");
