import type { SalesDto } from './dto';
import type { Sales } from './model';

export function adaptSalesDto(dto: SalesDto): Sales {
  return {
    id: dto.productId,
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
