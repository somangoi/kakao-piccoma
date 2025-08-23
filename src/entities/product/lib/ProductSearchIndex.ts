import Fuse, { type IFuseOptions } from 'fuse.js';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

const SEARCH_KEYS: (keyof JoinedRowWithDerived)[] = [
  'title',
  'author',
  'publisher',
];

export class ProductSearchIndex {
  private fuse: Fuse<JoinedRowWithDerived>;

  constructor(joinedRows: JoinedRowWithDerived[]) {
    const options: IFuseOptions<JoinedRowWithDerived> = {
      keys: ['title', 'author', 'publisher'],
      threshold: 0.45,
      distance: 100,
      ignoreLocation: true,
      includeScore: true,
    };

    const index = Fuse.createIndex(SEARCH_KEYS, joinedRows);
    this.fuse = new Fuse(joinedRows, options, index);
  }

  search(query: string): JoinedRowWithDerived[] {
    if (!query.trim()) return [];
    return this.fuse.search(query).map((r) => r.item);
  }
}
