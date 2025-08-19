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

export type ProductSalesDaily = {
  productId: number;
  date: Date;
  totalSales: number;
  totalReadUser: number;
  totalPaidUser: number;
  appSales: number;
  webSales: number;
};

export type ProductSummary = {
  product: Product;
  period: {
    days: number;
    startDate: Date;
    endDate: Date;
  };
  totals: {
    totalSales: number;
    totalReadUser: number;
    totalPaidUser: number;
  };
  series: ProductSalesDaily[];
};
