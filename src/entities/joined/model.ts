import type { Product } from '../product/model';
import type { Sales } from '../sales/model';

export type JoinedRow = Product & {
  series: Sales[];
};
