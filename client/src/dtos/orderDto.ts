export type OrderType = {
  _id: string;
  orderNo: string;
  subtotal: number;
  discount?: number;
  totalAmount: number;
  totalCost: number;
  customerName: string;
  orderName: string;
  isPaid: boolean;
  amountPaid: number[];
  user?: {
    _id: string;
    email: string;
  };
  transactionId?: string;
  invoiceNo?: string;
  reference?: string;
  charges?: number;
  cardType?: string;
  bank?: string;
  currency?: string;
  paymentDate?: Date[];
  paymentStatus?: string;
  orderStatus: string;
  address: string;
  phone?: string;
  state?: string;
  country?: string;
  note?: string;
  confirmationDate?: Date;
  confirmedBy?: string;
  shippingDate?: Date;
  shippedBy?: string;
  deliveryDate?: Date;
  deliveredBy?: string;
  createdAt?: Date;
  createdBy?: {
    _id: string;
    fullName: string;
  };
  postedBy?: string;
  isManual?: boolean;
  invoiceDate?: Date;
  invoicedBy?: {
    _id: string;
    fullName: string;
  };
  salesOrderStatus?: string;
};

export type OrderItemType = {
  _id: string;
  orderId: string;
  orderNo: string;
  productId: {
    _id: string;
    productName: string;
    productImage: string;
    color?: string[];
    size?: string[];
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
