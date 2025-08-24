export type SalesDto = {
  productId: number;
  salesDate: string; // "2025-06-21" (UTC 기준일)
  totalSales: number;
  totalReadUser: number;
  totalPaidUser: number;
  appSales: number;
  webSales: number;
  appReadUser: number;
  webReadUser: number;
  appPaidUser: number;
  webPaidUser: number;
};
