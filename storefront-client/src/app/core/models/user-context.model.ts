export interface UserContext {
  email: string;
  role: string;
  isAdmin: boolean;
  permissions: UserPermissions;
}

export interface UserPermissions {
  canCreateProduct: boolean;
  canDeleteProduct: boolean;
  canViewOrders: boolean;
  canPlaceOrder: boolean;
}
