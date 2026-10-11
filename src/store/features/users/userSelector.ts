import { RootState } from "@/store";

export const selectCustomers = (state: RootState) => state.customer.customers;
export const selectSelectedCustomer = (state: RootState) =>
  state.customer.selectedCustomer;
export const selectCustomerFilters = (state: RootState) =>
  state.customer.filters;
export const selectCustomerPagination = (state: RootState) =>
  state.customer.pagination;
export const selectCustomerLoading = (state: RootState) =>
  state.customer.isLoading;
export const selectCustomerError = (state: RootState) => state.customer.error;
