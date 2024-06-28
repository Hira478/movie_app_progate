import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { API_ACCESS_TOKEN } from "@env";
import type { Movie } from "../../../types/app";

interface KeywordSearchProps {
  onSearchResults: (movies: Movie[]) => void;
}

const KeywordSearch = ({
  onSearchResults,
}: KeywordSearchProps): JSX.Element => {
  const [keyword, setKeyword] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const searchMovies = async () => {
    if (keyword.trim() === "") return;

    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=${API_ACCESS_TOKEN}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Search results:", data.results);
      setMovies(data.results);
      onSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for movies..."
        value={keyword}
        onChangeText={setKeyword}
      />
      <Button title="Search" onPress={searchMovies} />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  movieItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  movieTitle: {
    fontSize: 16,
  },
});

export default KeywordSearch;
