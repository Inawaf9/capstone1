export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  balance: number;
}
export interface Category {
  id: string;
  name: string;
}
export interface Merchant {
  id: string;
  name: string;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string | null;
}
export interface MerchantStock {
  id: string;
  merchantId: string | null;
  productId: string | null;
  stock: number;
}
export interface ApiResponse {
  message: string;
}
export interface SystemSummary {
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalProducts: number;
  totalCategories: number;
  totalMerchants: number;
  totalStock: number;
  outOfStock: number;
  averagePrice: number;
}
