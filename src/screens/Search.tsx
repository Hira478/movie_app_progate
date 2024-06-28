import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import KeywordSearch from "../components/search/KeywordSearch";
import CategorySearch from "../components/search/CategorySearch";
import { API_ACCESS_TOKEN } from "@env";
import type { Movie } from "../../types/app";

const categories = [
  { id: "now_playing", title: "Now Playing" },
  { id: "upcoming", title: "Upcoming" },
  { id: "top_rated", title: "Top Rated" },
  { id: "popular", title: "Popular" },
];

const Search = (): JSX.Element => {
  const [selectedBar, setSelectedBar] = useState<string>("keyword");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const handleKeywordResults = async (movies: Movie[]) => {
    setSearchResults(movies);
  };

  const handleCategoryResults = async (movies: Movie[]) => {
    setSearchResults(movies);
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.searchResultItem}>
      <Text>{item.title}</Text>
    </View>
  );

  const keyExtractor = (item: Movie) => item.id.toString();

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        {["keyword", "category"].map((item: string, index: number) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.9}
            style={{
              ...styles.topBar,
              backgroundColor: item === selectedBar ? "#8978A4" : "#C0B4D5",
              borderTopLeftRadius: index === 0 ? 100 : 0,
              borderBottomLeftRadius: index === 0 ? 100 : 0,
              borderTopRightRadius: index === 1 ? 100 : 0,
              borderBottomRightRadius: index === 1 ? 100 : 0,
            }}
            onPress={() => {
              setSelectedBar(item);
            }}
          >
            <Text style={styles.topBarLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedBar === "keyword" ? (
        <KeywordSearch onSearchResults={handleKeywordResults} />
      ) : (
        <CategorySearch onCategoryResults={handleCategoryResults} />
      )}

      <View style={styles.searchResultsContainer}>
        <Text style={styles.searchResultsTitle}>Search Results</Text>
        <FlatList
          data={searchResults}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topBarContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  topBar: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: 60,
  },
  topBarLabel: {
    color: "white",
    fontSize: 20,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  searchResultsContainer: {
    marginTop: 24,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  searchResultItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default Search;
