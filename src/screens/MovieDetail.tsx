import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { API_ACCESS_TOKEN } from "@env";
import type { Movie } from "../../types/app";
import MovieList from "../components/movies/MovieList";

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    fetchMovieDetail();
    checkIsFavorite(id);
  }, [id]);

  const fetchMovieDetail = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setMovie(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setLoading(false);
    }
  };

  const checkIsFavorite = async (movieId: number): Promise<void> => {
    try {
      const favoriteMoviesData = await AsyncStorage.getItem("@FavoriteList");
      if (favoriteMoviesData !== null) {
        const favoriteMovies: Movie[] = JSON.parse(favoriteMoviesData);
        const isFav = favoriteMovies.some((movie) => movie.id === movieId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log("Error checking favorite status:", error);
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );
      let favMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log("Error adding favorite movie:", error);
    }
  };

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );

      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData);
        const updatedFavMovieList = favMovieList.filter(
          (movie) => movie.id !== movieId
        );

        await AsyncStorage.setItem(
          "@FavoriteList",
          JSON.stringify(updatedFavMovieList)
        );
        setIsFavorite(false);
      }
    } catch (error) {
      console.log("Error removing favorite movie:", error);
    }
  };

  const toggleFavorite = (): void => {
    if (movie) {
      if (isFavorite) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {movie && (
        <>
          <View style={styles.thumbnailContainer}>
            <Image
              style={styles.thumbnail}
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={24}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
            <View style={styles.thumbnailOverlay}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
          <View style={styles.detailContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Original Language</Text>
              <Text style={styles.detailValue}>{movie.original_language}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Popularity</Text>
              <Text style={styles.detailValue}>{movie.popularity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Release Date</Text>
              <Text style={styles.detailValue}>
                {new Date(movie.release_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vote Count</Text>
              <Text style={styles.detailValue}>{movie.vote_count}</Text>
            </View>
          </View>
          <MovieList
            title="Recommendations"
            path={`movie/${id}/recommendations`}
            coverType="poster"
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
  },
  thumbnailContainer: {
    position: "relative",
    marginBottom: 16,
  },
  thumbnail: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  thumbnailOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 4,
  },
  detailValue: {
    marginBottom: 8,
  },
});

export default MovieDetail;
