"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { Customer } from "@/types/customer.types";
import { Eye, Mail, MapPin, Phone } from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
}

function getStatusBadge(status: Customer["status"]) {
  const map = {
    ACTIVE: { label: "Active", variant: "success" as const },
    BLOCKED: { label: "Blocked", variant: "danger" as const },
    SUSPENDED: { label: "Suspended", variant: "warning" as const },
  };
  const config = map[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function CustomerTable({
  customers,
  isLoading,
  onViewDetails,
}: CustomerTableProps) {
  if (isLoading && customers.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && customers.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500 text-sm">No customers found</p>
        <p className="text-gray-400 text-xs mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Jobs
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={customer.avatar}
                      firstName={customer.firstName}
                      lastName={customer.lastName}
                      size="md"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer.preferredLanguage === "si"
                          ? "සිංහල"
                          : "English"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {customer.city}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {customer.completedJobs}
                    </span>
                    <span className="text-gray-400">/{customer.totalJobs}</span>
                  </div>
                  {customer.cancelledJobs > 0 && (
                    <p className="text-xs text-red-500">
                      {customer.cancelledJobs} cancelled
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">{getStatusBadge(customer.status)}</td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {formatDate(customer.joinedAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewDetails(customer.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
