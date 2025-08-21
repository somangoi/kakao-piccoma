export type Product = {
  id: number;
  title: string;
  status: 'ON_SALE' | 'PAUSED' | 'ENDED' | 'ACTIVE';
  publisher: string;
  category: string;
  genre: string;
  author: string;
  tags: string[];
  startedAt: Date;
  thumbUrl: string;
};
