import { Chip, Stack, CircularProgress } from '@mui/material';
import { useGenres } from '@/features/filter/hooks/useGenres';
import { useFilterStore } from '../model/useFilterStore';

export const GenreFilter = () => {
  const { genres, isLoading } = useGenres();
  const { genres: selectedGenres, setFilter } = useFilterStore();

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setFilter({ genres: newGenres });
  };

  const handleAllToggle = () => {
    if (selectedGenres.length === 0) {
      return;
    } else {
      setFilter({ genres: [] });
    }
  };

  const isAllSelected = selectedGenres.length === 0;

  if (isLoading) return <CircularProgress size={24} />;

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip
        label={'All'}
        onClick={handleAllToggle}
        variant={isAllSelected ? 'filled' : 'outlined'}
        color={isAllSelected ? 'primary' : 'default'}
        clickable
      />
      {genres.map((genre) => (
        <Chip
          key={genre}
          label={genre}
          onClick={() => handleGenreToggle(genre)}
          variant={selectedGenres.includes(genre) ? 'filled' : 'outlined'}
          color={selectedGenres.includes(genre) ? 'primary' : 'default'}
          clickable
        />
      ))}
    </Stack>
  );
};
