"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import {
  selectCustomerLoading,
  selectSelectedCustomer,
} from "@/store/features/customer/customerSelector";
import { fetchCustomerById } from "@/store/features/customer/customerThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  AlertTriangle,
  Briefcase,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  X,
} from "lucide-react";
import { useEffect } from "react";

interface CustomerDetailsModalProps {
  customerId: string;
  onClose: () => void;
}

export function CustomerDetailsModal({
  customerId,
  onClose,
}: CustomerDetailsModalProps) {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectSelectedCustomer);
  const isLoading = useAppSelector(selectCustomerLoading);

  useEffect(() => {
    dispatch(fetchCustomerById(customerId));
  }, [customerId, dispatch]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading || !customer ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile header */}
              <div className="flex items-start gap-4">
                <Avatar
                  src={customer.avatar}
                  firstName={customer.firstName}
                  lastName={customer.lastName}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <Badge
                      variant={
                        customer.status === "ACTIVE"
                          ? "success"
                          : customer.status === "BLOCKED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Customer ID: {customer.id}
                  </p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={customer.email}
                />
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={customer.phone}
                />
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={`${customer.address}, ${customer.city}`}
                />
                <InfoRow
                  icon={<Globe className="h-4 w-4" />}
                  label="Preferred Language"
                  value={
                    customer.preferredLanguage === "si" ? "Sinhala" : "English"
                  }
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Joined"
                  value={formatDate(customer.joinedAt)}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Last Active"
                  value={formatDate(customer.lastActiveAt)}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox
                  icon={<Briefcase className="h-5 w-5" />}
                  label="Total Jobs"
                  value={customer.totalJobs}
                  color="text-blue-600 bg-blue-50"
                />
                <StatBox
                  icon={<Briefcase className="h-5 w-5" />}
                  label="Completed"
                  value={customer.completedJobs}
                  color="text-green-600 bg-green-50"
                />
                <StatBox
                  icon={<AlertTriangle className="h-5 w-5" />}
                  label="Cancelled"
                  value={customer.cancelledJobs}
                  color="text-red-600 bg-red-50"
                />
                <StatBox
                  icon={<Star className="h-5 w-5" />}
                  label="Rating"
                  value={customer.rating.toFixed(1)}
                  color="text-yellow-600 bg-yellow-50"
                />
              </div>

              {/* Cancellation status */}
              {customer.cancellationStatus !== "NONE" && (
                <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        Cancellation History: {customer.cancellationStatus}
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        This customer has {customer.cancelledJobs} cancelled{" "}
                        {customer.cancelledJobs === 1 ? "job" : "jobs"}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}
      >
        {icon}
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
