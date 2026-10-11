"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { customerService } from "@/store/features/users/userService";
import { AdminDirectoryUser, UserRole } from "@/types/user.types";
import axios from "axios";
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type RoleFilter = "ALL" | UserRole;

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export function UserDirectory() {
  const [users, setUsers] = useState<AdminDirectoryUser[]>([]);
  const [activeRole, setActiveRole] = useState<RoleFilter>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  //   useEffect(() => {
  //     const controller = new AbortController();
  //     console.log("Fetching users...", controller.signal); // Debugging line
  //     setLoading(true);
  //     setError(null);

  //     customerService
  //       .getUsers(controller.signal)
  //       .then(setUsers)
  //       .catch((requestError: unknown) => {
  //         if (!axios.isCancel(requestError)) {
  //           setError(
  //             axios.isAxiosError(requestError)
  //               ? (requestError.response?.data?.message ??
  //                   "Unable to load users. Please try again.")
  //               : "Unable to load users. Please try again.",
  //           );
  //         }
  //       })
  //       .finally(() => {
  //         if (!controller.signal.aborted) setLoading(false);
  //       });

  //     return () => controller.abort();
  //   }, [refreshKey]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const users = await customerService.getUsers(controller.signal);

        if (!controller.signal.aborted) {
          setUsers(users);
        }
      } catch (requestError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          axios.isAxiosError(requestError)
            ? (requestError.response?.data?.message ??
                "Unable to load users. Please try again.")
            : "Unable to load users. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => controller.abort();
  }, [refreshKey]);
  const customerCount = users.filter((user) => user.role === "CUSTOMER").length;
  const workerCount = users.filter((user) => user.role === "WORKER").length;

  const visibleUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return users
      .filter((user) => activeRole === "ALL" || user.role === activeRole)
      .filter((user) => {
        if (!searchTerm) return true;
        return [
          user.name,
          user.email,
          user.phone,
          user.profile?.city,
          user.role,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
  }, [activeRole, search, users]);

  const filters: { label: string; value: RoleFilter; count: number }[] = [
    { label: "All users", value: "ALL", count: users.length },
    { label: "Customers", value: "CUSTOMER", count: customerCount },
    { label: "Workers", value: "WORKER", count: workerCount },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Directory</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse registered customers and workers.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CountTile label="Total users" count={users.length} icon="users" />
        <CountTile label="Customers" count={customerCount} />
        <CountTile label="Workers" count={workerCount} icon="workers" />
      </section>

      <div className="flex flex-col gap-3 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex gap-5 overflow-x-auto"
          role="tablist"
          aria-label="Filter users by role"
        >
          {filters.map((filter) => {
            const selected = activeRole === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveRole(filter.value)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  selected
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {filter.label}
                <span
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    selected
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative mb-3 block w-full sm:mb-2 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone..."
            aria-label="Search users"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey((key) => key + 1)}
          >
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-lg border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : visibleUsers.length ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleUsers.map((user) => (
            <UserTile key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <Users className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-900">
            {search ? "No matching users" : "No users found"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {search
              ? "Try a different name, email, or phone number."
              : "Users will appear here once they register."}
          </p>
        </div>
      )}
    </div>
  );
}

function CountTile({
  label,
  count,
  icon,
}: {
  label: string;
  count: number;
  icon?: "users" | "workers";
}) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
            {count.toLocaleString()}
          </p>
        </div>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            {icon === "users" ? (
              <Users className="h-5 w-5" />
            ) : (
              <BriefcaseBusiness className="h-5 w-5" />
            )}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

function UserTile({ user }: { user: AdminDirectoryUser }) {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className="p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
            {initials || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="truncate font-semibold text-gray-900">
                {user.name}
              </h2>
              <Badge variant={user.role === "WORKER" ? "info" : "default"}>
                {user.role === "WORKER" ? "Worker" : "Customer"}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
          <p className="truncate">{user.phone || "No phone provided"}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Joined {formatDate(user.createdAt)}
            </span>
            {user.profile?.city && (
              <span className="inline-flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {user.profile.city}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : dateFormatter.format(date);
}
