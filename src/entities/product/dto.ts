export type ProductDto = {
  productId: number;
  title: string;
  status: 'S' | 'H' | 'E' | 'A'; // S=판매중, H=휴재, E=완결, A=활성
  publisher: string | null;
  category: string;
  genre: string;
  author: string;
  tags: string;
  startedSaleAt: string;
  thumbPath: string;
};
