"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  selectJobs,
  selectJobsError,
  selectJobsLoading,
  selectJobsUpdating,
} from "@/store/features/jobs/jobSelector";
import { fetchJobs, updateJobApproval } from "@/store/features/jobs/jobThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Job } from "@/types/job.types";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function normalizedStatus(status: string) {
  return status.trim().toUpperCase();
}

function statusBadge(status: string) {
  switch (normalizedStatus(status)) {
    case "APPROVED":
    case "APPROVE":
    case "OPEN":
      return <Badge variant="success">Approved</Badge>;
    case "REJECTED":
    case "REJECT":
      return <Badge variant="danger">Rejected</Badge>;
    default:
      return <Badge variant="warning">Pending</Badge>;
  }
}

function customerName(job: Job) {
  if (job.customerName) return job.customerName;
  if (job.customer?.name) return job.customer.name;

  return [job.customer?.firstName, job.customer?.lastName]
    .filter(Boolean)
    .join(" ") || "Unknown customer";
}

function jobDate(job: Job) {
  if (!job.createdAt) return "Not available";

  const date = new Date(job.createdAt);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : dateFormatter.format(date);
}

function jobLocation(job: Job) {
  return job.location || job.address || "Not provided";
}

export function JobList() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const isLoading = useAppSelector(selectJobsLoading);
  const isUpdating = useAppSelector(selectJobsUpdating);
  const error = useAppSelector(selectJobsError);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchJobs());
  }, [dispatch]);

  const summary = useMemo(
    () =>
      jobs.reduce(
        (counts, job) => {
          const status = normalizedStatus(job.status);
          counts.total += 1;
          if (
            status === "APPROVED" ||
            status === "APPROVE" ||
            status === "OPEN"
          ) {
            counts.approved += 1;
          } else if (status === "REJECTED" || status === "REJECT") {
            counts.rejected += 1;
          } else {
            counts.pending += 1;
          }
          return counts;
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 },
      ),
    [jobs],
  );
  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const handleApproval = async (
    id: string,
    decision: "APPROVE" | "REJECT",
  ) => {
    await dispatch(updateJobApproval({ id, decision }));
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Job management</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review jobs created by customers.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void dispatch(fetchJobs())}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total jobs"
          value={summary.total}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          color="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Pending"
          value={summary.pending}
          icon={<Clock3 className="h-5 w-5" />}
          color="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Approved"
          value={summary.approved}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="bg-green-50 text-green-600"
        />
        <SummaryCard
          label="Rejected"
          value={summary.rejected}
          icon={<XCircle className="h-5 w-5" />}
          color="bg-red-50 text-red-600"
        />
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">All jobs</h2>
        </div>
        {isLoading && jobs.length === 0 ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">No jobs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {["Job", "Customer", "Location", "Status", "Created", ""].map(
                    (label) => (
                      <th
                        key={label}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {job.title || "Untitled job"}
                      </p>
                      {job.category && (
                        <p className="mt-1 text-xs text-gray-500">{job.category}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {customerName(job)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {jobLocation(job)}
                    </td>
                    <td className="px-6 py-4">{statusBadge(job.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {jobDate(job)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedJobId(job.id)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedJob && (
        <JobDetailsDialog
          key={selectedJob.id}
          job={selectedJob}
          isUpdating={isUpdating}
          error={error}
          onApproval={handleApproval}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function JobDetailsDialog({
  job,
  isUpdating,
  error,
  onApproval,
  onClose,
}: {
  job: Job;
  isUpdating: boolean;
  error: string | null;
  onApproval: (
    id: string,
    decision: "APPROVE" | "REJECT",
  ) => Promise<void>;
  onClose: () => void;
}) {
  const canUpdateApproval = ![
    "APPROVED",
    "APPROVE",
    "OPEN",
    "REJECTED",
    "REJECT",
  ].includes(normalizedStatus(job.status));
  const [selectedStatus, setSelectedStatus] = useState<
    "APPROVE" | "REJECT" | null
  >(null);
  const [pendingStatus, setPendingStatus] = useState<
    "APPROVE" | "REJECT" | null
  >(null);

  const handleApproval = () => {
    if (!selectedStatus) return;

    setPendingStatus(selectedStatus);
    void onApproval(job.id, selectedStatus).finally(() => setPendingStatus(null));
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-950/50 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5 sm:p-6">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {job.title || "Job details"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 break-all text-sm text-gray-500">
                Job ID: {job.id}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close job details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="space-y-6 overflow-y-auto p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {statusBadge(job.status)}
              {job.category && <Badge variant="info">{job.category}</Badge>}
            </div>
            <section>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Customer details
              </h3>
              <InfoGrid
                items={[
                  { label: "Customer", value: customerName(job) },
                  {
                    label: "Email",
                    value: job.customer?.email || "Not provided",
                  },
                  {
                    label: "Phone",
                    value: job.customer?.phone || "Not provided",
                  },
                  { label: "Location", value: jobLocation(job) },
                  {
                    label: "Budget",
                    value:
                      job.budget === null || job.budget === undefined
                        ? "Not provided"
                        : String(job.budget),
                  },
                  { label: "Created", value: jobDate(job) },
                ]}
              />
            </section>
            <section>
              <h3 className="text-sm font-semibold text-gray-900">
                Description
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {job.description || "No description provided."}
              </p>
            </section>
            {canUpdateApproval && (
              <section className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Update status
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a status after reviewing the customer details.
                </p>
                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}
                <fieldset
                  disabled={isUpdating}
                  className="mt-4 flex flex-col gap-3 sm:flex-row"
                >
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-green-200 p-3 text-sm font-medium text-green-700 transition-colors hover:bg-green-50">
                    <input
                      type="radio"
                      name={`job-status-${job.id}`}
                      value="APPROVE"
                      checked={selectedStatus === "APPROVE"}
                      onChange={() => setSelectedStatus("APPROVE")}
                      className="h-4 w-4 accent-green-600"
                    />
                    Approve
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-red-200 p-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50">
                    <input
                      type="radio"
                      name={`job-status-${job.id}`}
                      value="REJECT"
                      checked={selectedStatus === "REJECT"}
                      onChange={() => setSelectedStatus("REJECT")}
                      className="h-4 w-4 accent-red-600"
                    />
                    Reject
                  </label>
                </fieldset>
                <div className="mt-4">
                  <Button
                    type="button"
                    variant={selectedStatus === "REJECT" ? "danger" : "primary"}
                    onClick={handleApproval}
                    isLoading={isUpdating && pendingStatus === selectedStatus}
                    disabled={isUpdating || !selectedStatus}
                  >
                    {selectedStatus === "REJECT"
                      ? "Reject job"
                      : "Approve job"}
                  </Button>
                </div>
              </section>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InfoGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">{item.label}</p>
          <p className="mt-1 break-words text-sm font-medium text-gray-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
