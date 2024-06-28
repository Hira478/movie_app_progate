import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, Button } from "react-native";
import { API_ACCESS_TOKEN } from "@env";
import type { Movie } from "../../../types/app";

const categories = [
  { id: "now_playing", title: "Now Playing" },
  { id: "upcoming", title: "Upcoming" },
  { id: "top_rated", title: "Top Rated" },
  { id: "popular", title: "Popular" },
];

interface CategorySearchProps {
  onCategoryResults: (movies: Movie[]) => void;
}

const CategorySearch = ({
  onCategoryResults,
}: CategorySearchProps): JSX.Element => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("now_playing");
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  const fetchMovies = async () => {
    const url = `https://api.themoviedb.org/3/movie/${selectedCategory}?api_key=${API_ACCESS_TOKEN}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Category movies:", data.results);
      setMovies(data.results);
      onCategoryResults(data.results);
    } catch (error) {
      console.error("Error fetching category movies:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryButtons}>
        {categories.map((category) => (
          <Button
            key={category.id}
            title={category.title}
            onPress={() => setSelectedCategory(category.id)}
          />
        ))}
      </View>
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
  categoryButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
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

export default CategorySearch;
