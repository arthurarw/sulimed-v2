import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

const StacksLayout = () => {
  const nav = useNavigation();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="contracts/[id]"
        options={{
          headerLeft: () => {
            return (
              <Ionicons
                name="menu"
                size={24}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer());
                }}
              />
            );
          },
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
