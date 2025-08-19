export type Sales = {
  productId: number;
  date: Date;
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

export type SalesSummary = {
  period: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  totals: {
    sales: number;
    readUsers: number;
    paidUsers: number;
  };
  breakdown: {
    app: {
      sales: number;
      readUsers: number;
      paidUsers: number;
    };
    web: {
      sales: number;
      readUsers: number;
      paidUsers: number;
    };
  };
};
