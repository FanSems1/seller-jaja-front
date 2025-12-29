/**
 * API Configuration
 * Centralized API base URL management for the project
 */

// Base URL for API endpoints
export const API_BASE_URL = "https://ecommerce.jaja.id";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth-jaja/login`,
  REGISTER: `${API_BASE_URL}/auth-jaja/register`,
  LOGOUT: `${API_BASE_URL}/auth-jaja/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth-jaja/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth-jaja/reset-password`,
};

// Product endpoints (contoh untuk endpoint lain)
export const PRODUCT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/seller/v2/produk/`,
  DETAIL: (id) => `${API_BASE_URL}/seller/v2/produk/${id}`,
  CREATE: `${API_BASE_URL}/seller/v2/produk/create`,
  UPDATE: (id) => `${API_BASE_URL}/seller/v2/produk/${id}`,
  DELETE: (id) => `${API_BASE_URL}/seller/v2/produk/${id}`,
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  LIST: `${API_BASE_URL}/seller/v2/pesanan/`,
  DETAIL: (id) => `${API_BASE_URL}/seller/v2/pesanan/${id}`,
  UPDATE_STATUS: (id) => `${API_BASE_URL}/seller/v2/pesanan/${id}/status`,
  TERIMA: (id) => `${API_BASE_URL}/seller/v2/pesanan/${id}/terima`,
  TOLAK: (id) => `${API_BASE_URL}/seller/v2/pesanan/${id}/tolak`,
  KIRIM: (id) => `${API_BASE_URL}/seller/v2/pesanan/${id}/kirim`,
};

// Etalase endpoints
export const ETALASE_ENDPOINTS = {
  LIST: `${API_BASE_URL}/seller/v2/etalase/`,
  CREATE: `${API_BASE_URL}/seller/v2/etalase/`,
  UPDATE: (id) => `${API_BASE_URL}/seller/v2/etalase/${id}`,
  DELETE: (id) => `${API_BASE_URL}/seller/v2/etalase/${id}`,
};

// Brand endpoints
export const BRAND_ENDPOINTS = {
  LIST: `${API_BASE_URL}/seller/v2/brand/`,
  CREATE: `${API_BASE_URL}/seller/v2/brand/`,
  UPDATE: (id) => `${API_BASE_URL}/seller/v2/brand/${id}`,
  DELETE: (id) => `${API_BASE_URL}/seller/v2/brand/${id}`,
};

// Review endpoints
export const REVIEW_ENDPOINTS = {
  TOKO_STATS: `${API_BASE_URL}/seller/v2/produk-review/`,
  PRODUCTS: `${API_BASE_URL}/seller/v2/produk-review/products`,
  PRODUCT_DETAIL: `${API_BASE_URL}/seller/v2/produk-review/products/:id/reviews`,
  REPLY: (ratingId) => `${API_BASE_URL}/seller/v2/produk-review/reviews/${ratingId}/reply`,
};

// Voucher endpoints
export const VOUCHER_ENDPOINTS = {
  LIST: `${API_BASE_URL}/seller/v2/voucher-toko/`,
  DETAIL: (id) => `${API_BASE_URL}/seller/v2/voucher-toko/${id}`,
  CREATE: `${API_BASE_URL}/seller/v2/voucher-toko/create`,
  UPDATE: (id) => `${API_BASE_URL}/seller/v2/voucher-toko/${id}`,
  TOGGLE: (id) => `${API_BASE_URL}/seller/v2/voucher-toko/${id}/toggle`,
};

// Category endpoints
export const CATEGORY_ENDPOINTS = {
  MEGA_MENU: `${API_BASE_URL}/main/kategories/mega-menu`,
};

// Helper function untuk fetch dengan error handling
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("auth_token");
  
  // Jangan set Content-Type jika body adalah FormData
  const isFormData = options.body instanceof FormData;
  
  const defaultHeaders = {};
  
  // Hanya set Content-Type: application/json jika bukan FormData
  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP Error ${response.status}`);
  }

  return response.json();
};

export default {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  PRODUCT_ENDPOINTS,
  ORDER_ENDPOINTS,
  ETALASE_ENDPOINTS,
  BRAND_ENDPOINTS,
  REVIEW_ENDPOINTS,
  apiFetch,
};
