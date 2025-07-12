// API configuration and types
const API_BASE_URL = "http://localhost:4000/api/auth";

// Response types matching backend
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: number;
    details?: any;
  };
}

// Request/Response types for each endpoint
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    created_at: string;
  };
  message: string;
}

export interface LoginRequest {
  identifier: string; // username or email
  password: string;
}

export interface LoginResponse {
  userId: string;
  message: string;
  otpSent: boolean;
  requiresVerification?: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    created_at: string;
  };
}

export interface VerifyEmailRequest {
  email: string;
  otpCode: string;
}

export interface VerifyEmailResponse {
  user: {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    created_at: string;
  };
  token: string;
  message: string;
}

export interface CompleteLoginRequest {
  userId: string;
  otpCode: string;
}

export interface CompleteLoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    created_at: string;
  };
  token: string;
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

export interface GetUserDataResponse {
  user: {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    created_at: string;
  };
}

// Custom error class for API errors
export class ApiError extends Error {
  code: number;
  status: number;
  details?: any;

  constructor(message: string, code: number, status: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Token management
const TOKEN_KEY = "auth_token";

export const tokenManager = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  hasToken: () => !!localStorage.getItem(TOKEN_KEY),
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add authorization header if token exists
  const token = tokenManager.getToken();
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      const error = data.error || { message: "Unknown error", code: 0 };
      throw new ApiError(
        error.message,
        error.code,
        response.status,
        error.details
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.", 0, 0);
    }

    throw new ApiError("An unexpected error occurred.", 0, 0);
  }
}

// API functions
export const authApi = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Initiate login (sends OTP)
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Verify email with OTP (for registration)
  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    return apiRequest<VerifyEmailResponse>("/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Complete login with OTP
  completeLogin: async (
    data: CompleteLoginRequest
  ): Promise<CompleteLoginResponse> => {
    return apiRequest<CompleteLoginResponse>("/complete-login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Resend verification OTP
  resendVerificationOtp: async (
    data: ResendOtpRequest
  ): Promise<ResendOtpResponse> => {
    return apiRequest<ResendOtpResponse>("/resend-verification", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Resend login OTP
  resendLoginOtp: async (
    data: ResendOtpRequest
  ): Promise<ResendOtpResponse> => {
    return apiRequest<ResendOtpResponse>("/resend-login-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get user data (protected)
  getUserData: async (): Promise<GetUserDataResponse> => {
    return apiRequest<GetUserDataResponse>("/user", {
      method: "GET",
    });
  },

  // Logout
  logout: () => {
    tokenManager.removeToken();
  },
};
