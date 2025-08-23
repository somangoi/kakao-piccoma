export type Product = {
  id: number;
  title: string;
  status: 'ON_SALE' | 'ACTIVE' | 'INACTIVE';
  publisher: string;
  category: string;
  genre: string;
  author: string;
  tags: string[];
  startedAt: Date;
  thumbUrl: string;
};
