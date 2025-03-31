export type SalesReportType = {
  _id: string;
  orderItems: [
    {
      _id: string;
      orderId: string;
      orderNo: string;
      productId: string;
      color: string;
      size: string;
      quantity: number;
      sellingPrice: number;
      discountPrice: number | undefined;
      costPrice: number;
      price: number;
      productName: string;
    }
  ];
  totalQuantity: number;
  totalOrderAmount: number;
};
