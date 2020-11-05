import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/Home";
import MinhasMensagens from "./pages/MinhasMensagens";
import Chat from "./pages/Chat";

const MyStack = createStackNavigator();

function Routes() {
  return (
    <MyStack.Navigator screenOptions={{ headerShown: false }}>
      <MyStack.Screen name="Home" component={Home} />
      <MyStack.Screen name="MinhasMensagens" component={MinhasMensagens} />
      <MyStack.Screen name="Chat" component={Chat} />
    </MyStack.Navigator>
  );
}

export default Routes;
