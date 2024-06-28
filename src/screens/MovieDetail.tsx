import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { API_ACCESS_TOKEN } from "@env";
import type { Movie } from "../../types/app";
import MovieList from "../components/movies/MovieList";

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMovieDetail();
  }, []);

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
            <View style={styles.thumbnailOverlay}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            </View>
          </View>
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
          </View>
          <View style={styles.detailContainer}>
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
  thumbnailOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    flexDirection: "column", // Changed to column
    justifyContent: "flex-start", // Adjusted alignment
    alignItems: "flex-start", // Adjusted alignment
  },
  movieTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8, // Added margin for spacing
  },
  rating: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 16, // Added margin for spacing between columns
  },
  detailLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailValue: {
    marginBottom: 8,
  },
});

export default MovieDetail;
