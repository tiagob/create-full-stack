---
id: tutorial_apollo_server_express
title: Apollo Server Express
---

**This tutorial assumes [Apollo Server Express backend](/docs/backend#apollo-server-express) was selected. If Hasura was selected, check out the [Hasura version](/docs/tutorial_hasura).**

In this tutorial we'll add an optional due date for todos.

Learn how to:

- Navigate your full stack
- Make cross platform changes

## Backend

We need to add the date column to Postgres and include it in the schema. The GraphQL resolver is written in a generic enough way that it will handle this change without modification.

Add the date column to `packages/server/src/entity/Todo.ts`:

```ts
  // ...

  @Column({ type: "date", nullable: true })
  date!: Date | null;
}
```

Update the GraphQL schema at `packages/server/src/graphql/schema.ts`:

```graphql
# Add custom GraphQL scalar
# https://www.apollographql.com/docs/apollo-server/schema/scalars-enums/#date-as-a-scalar
scalar Date

type Todo {
  id: Int!
  name: String!
  complete: Boolean!
  # Include the date in the Todo Entity
  date: Date
}

type Query {
  todos: [Todo!]!
}

type Mutation {
  # Add optional (no appended '!') date input
  createTodo(name: String!, date: Date): Todo!
  updateTodo(id: Int!, name: String, complete: Boolean): Todo
  deleteTodo(id: Int!): Todo
}
```

That's it!

_Since `synchronize: true` is set in `packages/server/ormconfig.js`, changes to `packages/server/src/entity/Todo.ts` will automatically sync to the database. Learn more about migrations on the [TypeORM docs](https://typeorm.io/#/migrations/how-migrations-work). To see how GraphQL requests are resolved check out `packages/server/src/getResolvers.ts`._

## Common

Common contains shared code across the full stack. It's used on the Apollo Server Express backend for testing. It's used for client Apollo GraphQL requests from both web and mobile.

Update the GraphQL query and create mutation requests to include "date".

In `packages/common/src/graphql/todos.graphql` update to:

```graphql
# Add a date scalar. This is defined on the backend
# Apollo Server Express scalar docs:
# https://www.apollographql.com/docs/apollo-server/schema/scalars-enums/#date-as-a-scalar
scalar Date

query Todos {
  todos {
    id
    name
    complete
    date
  }
}

mutation CreateTodo($name: String!, $date: Date) {
  createTodo(name: $name, date: $date) {
    id
    name
    complete
    date
  }
}
```

That's it!

_When your run `yarn start` from the root of the project TS code is generated and `packages/common` is built automatically. See [graphql-code-generator](https://graphql-code-generator.com/) to learn how this works._

## Web

If [web](/docs/web) was included, then follow these steps to configure it for the new todo date field.

_We're using the [Material-UI Pickers library](https://material-ui-pickers.dev/getting-started/installation) for the date picker. This has a couple dependencies._

First, install the packages:

```bash
cd packages/web/
yarn add @date-io/date-fns@1.x date-fns @material-ui/pickers
```

Add `MuiPickersUtilsProvider` to `packages/web/src/App.tsx`:

_This tells pickers which date management library it should use with MuiPickersUtilsProvider. This component takes a utils prop, and makes it available down the React tree with React Context. It should be used at the root of your component tree, or at the highest level you wish the pickers to be available._

```tsx
// Add the imports
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

// ...

   return (
     <ApolloProvider client={apolloClient}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          {
            // ...
          }
        </Router>
      </MuiPickersUtilsProvider>
     </ApolloProvider>
   );
 }
```

Update `packages/web/src/components/CreateTodo.tsx`:

```tsx
// ...
// Add the import
import { KeyboardDatePicker } from "@material-ui/pickers";

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo, { loading }] = useCreateTodo();
  // Use a react hook to store the input date state.
  // Dates are optional. If not set, the value is null.
  const [date, setDate] = useState<Date | null>(null);

  function onSubmit() {
    // Add "date" to the createTodo variables
    createTodo({ variables: { name, date } });
    setName("");
    // Reset the input date to null after submission
    setDate(null);
  }

  return (
    <TextField
      // ...
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="M/dd/yyyy"
              margin="normal"
              label="Date"
              value={date}
              onChange={setDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <IconButton aria-label="add" onClick={onSubmit} disabled={loading}>
              <AddIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
```

Update `ListItemText` in `packages/web/src/components/Todo.tsx`:

```tsx
<ListItemText
  // If date is set, display it in the todo item
  primary={`${todo.name}${
    // toLocaleDateString("en-US") uses "M/dd/yyyy" date formatting
    todo.date ? ` (${new Date(todo.date).toLocaleDateString("en-US")})` : ""
  }`}
  classes={todo.complete ? { primary: classes.complete } : undefined}
/>
```

Kill and restart the full stack (required when libraries are added):

```bash
^C # Ctrl-C
yarn start
```

Navigate to http://localhost:3000. You should see your new todo date field! 🎉

<img alt="Add date web" src="/img/add_date_web.png" width="512" />

## Mobile

If [mobile](/docs/mobile) was included, then follow these steps to configure it for the new todo date field.

_We're using the [react-native-modal-datetime-picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker) for the date picker._

First, install the package and dependency:

```bash
cd packages/mobile/
yarn expo install react-native-modal-datetime-picker @react-native-community/datetimepicker
```

_We're using `yarn expo install` to ensure Expo supported versions of the libraries are used. Since Expo uses native code in its SDK, typically only a single version of a library with native dependencies can be used per version of Expo. Expo handles this mapping with its install command. Learn more on the [Expo docs](https://docs.expo.io/workflow/expo-cli/)._

Update `packages/mobile/src/components/CreateTodo.tsx`:

```tsx
// ...
// Add the import
import { Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const styles = StyleSheet.create({
  // ...
  row: {
    display: "flex",
    flexDirection: "row",
  },
});

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo] = useCreateTodo();
  // Use a react hook to store the input date state.
  // Dates are optional. If not set, the value is null.
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  function onSubmit() {
    // Add "date" to the createTodo variables
    createTodo({ variables: { name, date } });
    setName("");
    // Reset the input date to null after submission
    setDate(null);
  }

  return (
    <View style={styles.root}>
      <Input
        placeholder="What needs to be done?"
        value={name}
        onChangeText={(text: string) => setName(text)}
        onSubmitEditing={onSubmit}
        rightIcon={
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.row}
              accessibilityLabel="date"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {
                  // toLocaleDateString("en-US") uses "M/dd/yyyy" date formatting
                  date?.toLocaleDateString("en-US")
                }
              </Text>
              <Icon name="event" />
            </TouchableOpacity>
            <Icon name="add" accessibilityLabel="submit" onPress={onSubmit} />
          </View>
        }
      />
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(dueDate) => {
          setDate(dueDate);
          setShowDatePicker(false);
        }}
        onCancel={() => {
          setDate(null);
          setShowDatePicker(false);
        }}
      />
    </View>
  );
}
```

Update `ListItem.Title` in `packages/mobile/src/components/Todo.tsx`:

```tsx
<ListItem.Title style={todo.complete ? styles.lineThrough : undefined}>
  {
    // If date is set, display it in the todo item
    `${todo.name}${
      // toLocaleDateString("en-US") uses "M/dd/yyyy" date formatting
      todo.date ? ` (${new Date(todo.date).toLocaleDateString("en-US")})` : ""
    }`
  }
</ListItem.Title>
```

Kill and restart the full stack (required when libraries are added):

```bash
^C # Ctrl-C
yarn start
```

Navigate to http://localhost:19002/ and bring up the application. You should see your new todo date field! 🎉

<img alt="Add date mobile" src="/img/add_date_mobile.png" height="512" />
