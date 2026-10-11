import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import {
  Customer,
  CustomerFilters,
  CustomerListResponse,
} from "@/types/customer.types";

export const customerService = {
  getCustomers: async (
    filters: CustomerFilters,
  ): Promise<CustomerListResponse> => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.city) params.append("city", filters.city);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await axiosInstance.get<ApiResponse<CustomerListResponse>>(
      `/admin/customers?${params.toString()}`,
    );
    return response.data.data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await axiosInstance.get<ApiResponse<Customer>>(
      `/admin/customers/${id}`,
    );
    return response.data.data;
  },

  updateCustomerStatus: async (
    id: string,
    status: Customer["status"],
  ): Promise<Customer> => {
    const response = await axiosInstance.patch<ApiResponse<Customer>>(
      `/admin/customers/${id}/status`,
      { status },
    );
    return response.data.data;
  },
};
