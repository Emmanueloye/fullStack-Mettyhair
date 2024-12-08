export type OrderType = {
  _id: string;
  orderNo: string;
  subtotal: number;
  discount?: number;
  totalAmount: number;
  customerName: string;
  orderName: string;
  user: {
    _id: string;
    email: string;
  };
  transactionId: string;
  invoiceNo: string;
  reference: string;
  charges?: number;
  cardType?: string;
  bank?: string;
  currency?: string;
  paymentDate?: Date;
  orderStatus: string;
  address: string;
  phone: string;
  state: string;
  country: string;
  note?: string;
  confirmationDate?: Date;
  confirmedBy?: string;
  shippingDate?: Date;
  shippedBy?: string;
  deliveryDate?: Date;
  deliveredBy?: string;
  createdAt?: Date;
  postedBy?: string;
  isManuel?: boolean;
};

export type OrderItemType = {
  _id: string;
  orderId: string;
  orderNo: string;
  productId: {
    _id: string;
    productName: string;
    productImage: string;
  };
  color?: string;
  size?: string;
  quantity: number;
  sellingPrice: number;
  discountPrice?: number;
  costPrice: number;
  price: number;
  createdAt: Date;
};
