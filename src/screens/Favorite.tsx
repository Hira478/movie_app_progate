import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieItem from "../components/movies/MovieItem";
import type { Movie } from "../../types/app";

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const fetchFavoriteMovies = async (): Promise<void> => {
    try {
      const favoriteMoviesData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );

      if (favoriteMoviesData !== null) {
        const parsedFavoriteMovies: Movie[] = JSON.parse(favoriteMoviesData);
        setFavoriteMovies(parsedFavoriteMovies);
      }
    } catch (error) {
      console.log("Error fetching favorite movies:", error);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }): JSX.Element => (
    <MovieItem
      movie={item}
      size={{ width: 120, height: 180 }}
      coverType="poster"
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      {favoriteMovies.length === 0 ? (
        <Text style={styles.emptyText}>No favorite movies yet.</Text>
      ) : (
        <FlatList
          data={favoriteMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => `${item.id}`}
          contentContainerStyle={styles.listContainer}
          numColumns={3}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 50,
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});

export default Favorite;
