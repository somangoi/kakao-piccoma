import { usePublishers } from '../hooks/usePublishers';
import { Chip, CircularProgress, Stack } from '@mui/material';
import { useFilterStore } from '../model/useFilterStore';

const PublishersFilter = () => {
  const { publishers, isLoading } = usePublishers();
  const { publishers: selectedPublishers, setFilter } = useFilterStore();

  const handleAllToggle = () => {
    if (selectedPublishers.length === 0) {
      return;
    } else {
      setFilter({ publishers: [] });
    }
  };

  const handlePublisherToggle = (publisher: string) => {
    const newPublishers = selectedPublishers.includes(publisher)
      ? selectedPublishers.filter((p) => p !== publisher)
      : [...selectedPublishers, publisher];

    setFilter({ publishers: newPublishers });
  };

  const isAllSelected = selectedPublishers.length === 0;

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
      {publishers.map((publisher) => (
        <Chip
          key={publisher}
          label={publisher}
          onClick={() => handlePublisherToggle(publisher)}
          variant={
            selectedPublishers.includes(publisher) ? 'filled' : 'outlined'
          }
          color={selectedPublishers.includes(publisher) ? 'primary' : 'default'}
          clickable
        />
      ))}
    </Stack>
  );
};

export default PublishersFilter;
