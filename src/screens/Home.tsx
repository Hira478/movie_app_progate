import React from "react";
import { View, Text, Button } from "react-native";

export default function Home({ navigation }: any): JSX.Element {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to Movie Detail"
        onPress={() => navigation.navigate("MovieDetail")}
      />
    </View>
  );
}
