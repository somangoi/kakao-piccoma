export const queryKeys = {
  products: {
    all: ['products'] as const,
  },
  sales: {
    all: ['sales'] as const,
    joined: (productIds: number[]) =>
      ['sales', 'joined', ...productIds.sort()] as const,
  },
};
