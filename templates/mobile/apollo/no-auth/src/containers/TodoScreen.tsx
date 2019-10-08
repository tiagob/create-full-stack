import React from "react";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Text,
  Content,
  List
} from "native-base";
import CreateTodo from "../components/CreateTodo";
import Todo from "../components/Todo";
import { NavigationScreenProps } from "react-navigation";
import { useTodosQuery } from "common";

export default function HeaderIconTextButtonExample({
  navigation
}: NavigationScreenProps) {
  const { data } = useTodosQuery();
  return (
    <Container>
      <Header>
        <Left />
        <Body>
          <Title>Todos</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.push("About")}>
            <Text>About</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <CreateTodo />
        <List>
          {(data && data.todos ? data.todos : []).map((todo, index) => (
            <Todo key={index} todo={todo} />
          ))}
        </List>
      </Content>
    </Container>
  );
}
