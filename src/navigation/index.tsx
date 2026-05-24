import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import { CameraScreen } from "../screens/CameraScreen";
import { LogScreen } from "../screens/LogScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { SpeciesDetailScreen } from "../screens/SpeciesDetailScreen";
import { useTheme } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CameraStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { color: theme.headerText },
      }}
    >
      <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Result" component={ResultScreen} options={{ title: "Results" }} />
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetailScreen}
        options={({ route }: any) => ({ title: route.params?.prediction?.species ?? "Species" })}
      />
    </Stack.Navigator>
  );
}

function LogStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { color: theme.headerText },
      }}
    >
      <Stack.Screen name="Log" component={LogScreen} options={{ title: "My Sightings" }} />
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetailScreen}
        options={({ route }: any) => ({ title: route.params?.prediction?.species ?? "Species" })}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.tabBarBorder,
        },
      }}
    >
      <Tab.Screen
        name="CameraTab"
        component={CameraStack}
        options={{
          title: "Identify",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📷</Text>,
        }}
      />
      <Tab.Screen
        name="LogTab"
        component={LogStack}
        options={{
          title: "Sightings",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
