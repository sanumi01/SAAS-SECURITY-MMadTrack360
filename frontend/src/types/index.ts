export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  growth: number;
  securityScore: number;
  trend: 'up' | 'down';
  alerts?: number;
  incidents?: number;
}

export interface Activity {
  id: number;
  userId: string;
  user: string;
  action: string;
  description?: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed' | 'warning';
  type?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
