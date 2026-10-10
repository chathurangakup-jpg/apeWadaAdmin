import { RootState } from "@/store";
import {
  Customer,
  CustomerFilters,
  CustomerListResponse,
} from "@/types/customer.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customerService } from "./customerService";

export const fetchCustomers = createAsyncThunk<
  CustomerListResponse,
  CustomerFilters | void,
  { rejectValue: string; state: RootState }
>("customer/fetchAll", async (filters, { rejectWithValue, getState }) => {
  try {
    const stateFilters = getState().customer.filters;
    const appliedFilters = { ...stateFilters, ...(filters || {}) };
    return await customerService.getCustomers(appliedFilters);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

export const fetchCustomerById = createAsyncThunk<
  Customer,
  string,
  { rejectValue: string }
>("customer/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await customerService.getCustomerById(id);
  } catch (error) {
    return rejectWithValue("Failed to fetch customer");
  }
});

export const updateCustomerStatus = createAsyncThunk<
  Customer,
  { id: string; status: Customer["status"] },
  { rejectValue: string }
>("customer/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await customerService.updateCustomerStatus(id, status);
  } catch (error) {
    return rejectWithValue("Failed to update customer status");
  }
});
