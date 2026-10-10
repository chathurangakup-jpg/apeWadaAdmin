import { CustomerFilters, CustomerState } from "@/types/customer.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCustomerById,
  fetchCustomers,
  updateCustomerStatus,
} from "./customerThunk";

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  filters: {
    search: "",
    status: undefined,
    city: undefined,
    page: 1,
    limit: 10,
    sortBy: "joinedAt",
    sortOrder: "desc",
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CustomerFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.customers;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(updateCustomerStatus.fulfilled, (state, action) => {
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      if (state.selectedCustomer?.id === action.payload.id) {
        state.selectedCustomer = action.payload;
      }
    });
  },
});

export const { setFilters, resetFilters, clearSelectedCustomer, clearError } =
  customerSlice.actions;
export default customerSlice.reducer;
