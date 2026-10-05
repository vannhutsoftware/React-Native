import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type Movie = {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isWatched: boolean;
};

type MovieCardProps = {
  movie: Movie;
  layout?: 'row' | 'tile';
  onSelect: (id: string) => void;
};

function MovieCard({ movie, layout = 'row', onSelect }: MovieCardProps) {
  const isTile = layout === 'tile';

  return (
    <TouchableOpacity
      style={[styles.card, isTile && styles.cardTile]}
      onPress={() => onSelect(movie.id)}
    >
      <View style={[styles.posterBox, isTile && styles.posterBoxTile]}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />
        {isTile && (
          <Text style={styles.ratingBadge}>{`\u2b50 ${movie.rating.toFixed(1)}`}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={isTile ? 1 : undefined}>
          {movie.title}
        </Text>
        {!isTile && <Text>{movie.genre}</Text>}
        {!isTile && <Text>{movie.year}</Text>}
        {!isTile && <Text>{`\u2b50 ${movie.rating.toFixed(1)}`}</Text>}
        <Text>{movie.isWatched ? '\u0110\u00e3 xem \u2705' : 'Ch\u01b0a xem \u23f3'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  cardTile: {
    flexDirection: 'column',
  },
  posterBox: {
    height: 100,
    marginRight: 12,
    width: 70,
  },
  posterBoxTile: {
    aspectRatio: 2 / 3,
    height: undefined,
    marginRight: 0,
    width: '100%',
  },
  poster: {
    height: '100%',
    width: '100%',
  },
  ratingBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    right: 6,
    top: 6,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
