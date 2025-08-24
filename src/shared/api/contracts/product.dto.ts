export type ProductDto = {
  productId: number;
  title: string;
  status: 'S' | 'A' | 'I'; // S=판매중, A=활성, I=비활성
  publisher: string | null;
  category: string;
  genre: string;
  author: string;
  tags: string;
  startedSaleAt: string;
  thumbPath: string;
};
