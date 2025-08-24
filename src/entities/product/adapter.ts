import type { ProductDto } from '@/shared/api/contracts/product.dto';
import type { Product } from './model';

const statusMap = {
  S: 'ON_SALE' as const,
  A: 'ACTIVE' as const,
  I: 'INACTIVE' as const,
};

export function adaptProductDto(dto: ProductDto): Product {
  return {
    id: dto.productId,
    title: dto.title,
    status: statusMap[dto.status],
    publisher: dto.publisher || '',
    category: dto.category,
    genre: dto.genre,
    author: dto.author,
    tags: dto.tags ? dto.tags.split(',').map((tag) => tag.trim()) : [],
    startedAt: new Date(dto.startedSaleAt),
    thumbUrl: dto.thumbPath,
  };
}
