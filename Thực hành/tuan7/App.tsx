import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MovieCard, { Movie } from "./components/MovieCard";

const API_URL = "https://6ac33cb0ae53bf25b80e379c.mockapi.io/Movies";
const PAGE_SIZE = 10;

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [failedPage, setFailedPage] = useState<number | null>(null);
  const [isTile, setIsTile] = useState(false);
  const isFetchingRef = useRef(false);
  const numColumns = isTile ? 2 : 1;

  const fetchMovies = useCallback(
    async (pageToLoad: number, replace = false) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setFailedPage(null);

      if (!replace && pageToLoad > 1) {
        setLoadingMore(true);
      }

      try {
        const response = await fetch(
          `${API_URL}?page=${pageToLoad}&limit=${PAGE_SIZE}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load movies");
        }

        const data: Movie[] = await response.json();

        setMovies((currentMovies) => {
          const nextMovies = replace ? [] : currentMovies;
          const ids = new Set(nextMovies.map((movie) => movie.id));
          const uniqueMovies = data.filter((movie) => {
            if (ids.has(movie.id)) {
              return false;
            }

            ids.add(movie.id);
            return true;
          });

          return [...nextMovies, ...uniqueMovies];
        });
        setPage(pageToLoad);
        setHasMore(data.length === PAGE_SIZE);
      } catch (error) {
        console.log(error);
        setFailedPage(pageToLoad);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchMovies(1, true);
  }, [fetchMovies]);

  const handleRefresh = () => {
    setHasMore(true);
    setRefreshing(true);
    fetchMovies(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && !refreshing && hasMore && !failedPage) {
      fetchMovies(page + 1);
    }
  };

  const handleRetry = () => {
    if (failedPage) {
      fetchMovies(failedPage, failedPage === 1);
    }
  };

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator style={styles.footer} />;
    }

    if (failedPage) {
      return (
        <View style={styles.footer}>
          <Text>{"T\u1ea3i th\u1ea5t b\u1ea1i"}</Text>
          <Button title={"Th\u1eed l\u1ea1i"} onPress={handleRetry} />
        </View>
      );
    }

    if (!hasMore) {
      return (
        <Text style={styles.footer}>
          {"\u2014 \u0110\u00e3 h\u1ebft danh s\u00e1ch \u2014"}
        </Text>
      );
    }

    return null;
  };

  const handleSelectMovie = (id: string) => {
    const movie = movies.find((item) => item.id === id);

    if (movie) {
      Alert.alert(`${movie.title} (${movie.year})`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Movie App</Text>
          <View style={styles.header}>
            <Text>{"D\u1ea1ng l\u01b0\u1edbi"}</Text>
            <Switch value={isTile} onValueChange={setIsTile} />
          </View>
          {loading ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <FlatList
              key={String(numColumns)}
              data={movies}
              numColumns={numColumns}
              keyExtractor={(item) => item.id}
              columnWrapperStyle={isTile ? styles.columnWrapper : undefined}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              renderItem={({ item }) => (
                <View style={isTile ? styles.tileItem : styles.rowItem}>
                  <MovieCard
                    movie={item}
                    layout={isTile ? "tile" : "row"}
                    onSelect={handleSelectMovie}
                  />
                </View>
              )}
            />
          )}
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  loading: {
    marginTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  rowItem: {
    flex: 1,
  },
  tileItem: {
    width: "48%",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
});
