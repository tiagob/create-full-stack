import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import TodoScreen from "./src/containers/TodoScreen";
import AboutScreen from "./src/containers/AboutScreen";
import { ApolloProvider } from "react-apollo-hooks";
import { client } from "./src/utils/apolloClient";

const MainNavigator = createStackNavigator(
  {
    Todo: ({ ...props }) => (
      <ApolloProvider client={client}>
        <TodoScreen {...props} />
      </ApolloProvider>
    ),
    About: AboutScreen
  },
  {
    initialRouteName: "Todo",
    headerMode: "none"
  }
);

const App = createAppContainer(MainNavigator);

export default App;
