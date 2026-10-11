"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/lib/useDebounce";
import {
  selectCustomerError,
  selectCustomerFilters,
  selectCustomerLoading,
  selectCustomerPagination,
  selectCustomers,
} from "@/store/features/users/userSelector";
import {
  clearSelectedCustomer,
  setFilters,
} from "@/store/features/users/userSlice";
import { fetchCustomers } from "@/store/features/users/userThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CustomerFilters } from "@/types/customer.types";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomerDetailsModal } from "./CustomerDetailsModal";
import { CustomerTable } from "./CustomerTable";

export function CustomerList() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const isLoading = useAppSelector(selectCustomerLoading);
  const error = useAppSelector(selectCustomerError);
  const filters = useAppSelector(selectCustomerFilters);
  const pagination = useAppSelector(selectCustomerPagination);

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    //dispatch(fetchCustomers(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.limit, filters.status, debouncedSearch]);

  // Sync debounced search to filters
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilters({ search: debouncedSearch, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleRefresh = () => {
    dispatch(fetchCustomers(filters));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setFilters({ page: newPage }));
  };

  const handleStatusFilter = (status: CustomerFilters["status"]) => {
    dispatch(setFilters({ status, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage registered customers
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or phone..."
              icon={<Search className="h-4 w-4" />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["ALL", "ACTIVE", "BLOCKED", "SUSPENDED"] as const).map(
              (status) => {
                const isActive =
                  status === "ALL"
                    ? !filters.status
                    : filters.status === status;
                return (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusFilter(
                        status === "ALL"
                          ? undefined
                          : (status as CustomerFilters["status"]),
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        onViewDetails={(id) => setSelectedId(id)}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> customers
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedId && (
        <CustomerDetailsModal
          customerId={selectedId}
          onClose={() => {
            setSelectedId(null);
            dispatch(clearSelectedCustomer());
          }}
        />
      )}
    </div>
  );
}
