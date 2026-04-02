export interface Order {
  id: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CreateOrderRequest {
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}
