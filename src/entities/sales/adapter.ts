import type { SalesDto } from './dto';
import type { Sales } from './model';
import type { ProductSalesDaily } from '@/entities/product/model';

export function adaptSalesDto(dto: SalesDto): Sales {
  return {
    productId: dto.productId,
    date: new Date(dto.salesDate),
    totalSales: dto.totalSales,
    totalReadUser: dto.totalReadUser,
    totalPaidUser: dto.totalPaidUser,
    appSales: dto.appSales,
    webSales: dto.webSales,
    appReadUser: dto.appReadUser,
    webReadUser: dto.webReadUser,
    appPaidUser: dto.appPaidUser,
    webPaidUser: dto.webPaidUser,
  };
}

export function salesToProductSalesDaily(sales: Sales): ProductSalesDaily {
  return {
    productId: sales.productId,
    date: sales.date,
    totalSales: sales.totalSales,
    totalReadUser: sales.totalReadUser,
    totalPaidUser: sales.totalPaidUser,
    appSales: sales.appSales,
    webSales: sales.webSales,
  };
}
