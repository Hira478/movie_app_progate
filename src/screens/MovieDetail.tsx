import React from "react";
import { View, Text, Button } from "react-native";
import { TMDB_API_READ_ACCESS_TOKEN } from "@env";

const MovieDetail = ({ navigation }: any): JSX.Element => {
  const fetchData = (): void => {
    const url =
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Movie Detail Page</Text>
      <Button
        title="Fetch Data"
        onPress={() => {
          fetchData();
        }}
      />
    </View>
  );
};

export default MovieDetail;
