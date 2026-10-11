"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminDirectoryUser } from "@/types/user.types";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";

interface UserDetailsDialogProps {
  user: AdminDirectoryUser;
  onClose: () => void;
}

export function UserDetailsDialog({ user, onClose }: UserDetailsDialogProps) {
  const profile = user.profile;
  const isWorker = user.role === "WORKER";
  const isApproved = profile?.approvalStatus?.toUpperCase() === "APPROVED";
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-950/50 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-2xl outline-none">
          <div className="flex items-start gap-4 border-b border-gray-200 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base font-semibold text-blue-700">
              {initials || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {user.name}
                </Dialog.Title>
                <Badge variant={isWorker ? "info" : "default"}>
                  {isWorker ? "Worker" : "Customer"}
                </Badge>
                <Badge variant={user.isActive ? "success" : "default"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Dialog.Description className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close user profile"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-7 overflow-y-auto p-5 sm:p-6">
            <ProfileSection title="Account details">
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <DetailItem icon={<Mail />} label="Email" value={user.email} />
                <DetailItem icon={<Phone />} label="Phone" value={user.phone} />
                <DetailItem
                  icon={<Languages />}
                  label="Preferred language"
                  value={formatLanguage(user.preferredLanguage)}
                />
                <DetailItem
                  icon={<CalendarDays />}
                  label="Registered"
                  value={formatDateTime(user.createdAt)}
                />
                <DetailItem
                  icon={<Clock3 />}
                  label="Last login"
                  value={formatDateTime(user.lastLoginAt)}
                />
                <DetailItem
                  icon={<Clock3 />}
                  label="Account updated"
                  value={formatDateTime(user.updatedAt)}
                />
              </div>
            </ProfileSection>

            {!isWorker && (
              <ProfileSection title="Customer profile">
                {profile ? (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    <DetailItem
                      icon={<MapPin />}
                      label="Address"
                      value={profile.address}
                    />
                    <DetailItem
                      icon={<MapPin />}
                      label="City"
                      value={profile.city}
                    />
                    <DetailItem
                      icon={<MapPin />}
                      label="District"
                      value={profile.district}
                    />
                    <DetailItem
                      icon={<MapPin />}
                      label="Venue"
                      value={profile.venue}
                    />
                    <DetailItem
                      icon={<CalendarDays />}
                      label="Profile created"
                      value={formatDateTime(profile.createdAt)}
                    />
                    <DetailItem
                      icon={<Clock3 />}
                      label="Profile updated"
                      value={formatDateTime(profile.updatedAt)}
                    />
                  </div>
                ) : (
                  <EmptyValue>No customer profile has been added.</EmptyValue>
                )}
              </ProfileSection>
            )}

            {isWorker && (
              <>
                <ProfileSection title="Worker profile">
                  {profile?.bio && (
                    <p className="mb-5 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {profile.bio}
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    <DetailItem
                      icon={<MapPin />}
                      label="City"
                      value={profile?.city}
                    />
                    <DetailItem
                      icon={<MapPin />}
                      label="District"
                      value={profile?.district}
                    />
                    <DetailItem
                      icon={<MapPin />}
                      label="Venue"
                      value={profile?.venue}
                    />
                    <DetailItem
                      icon={<BriefcaseBusiness />}
                      label="Years of experience"
                      value={
                        profile?.experienceYears != null
                          ? `${profile.experienceYears} years`
                          : null
                      }
                    />
                    <DetailItem
                      icon={<ShieldCheck />}
                      label="Availability"
                      value={formatStatus(profile?.availabilityStatus)}
                    />
                    <DetailItem
                      icon={<Star />}
                      label="Rating"
                      value={
                        profile?.averageRating != null
                          ? `${profile.averageRating.toFixed(1)} (${profile.reviewCount ?? 0} reviews)`
                          : profile?.reviewCount != null
                            ? `${profile.reviewCount} reviews`
                            : null
                      }
                    />
                    <DetailItem
                      icon={<Languages />}
                      label="Education summary"
                      value={profile?.educationSummary}
                    />
                    <DetailItem
                      icon={<CalendarDays />}
                      label="Profile created"
                      value={formatDateTime(profile?.createdAt)}
                    />
                    <DetailItem
                      icon={<Clock3 />}
                      label="Profile updated"
                      value={formatDateTime(profile?.updatedAt)}
                    />
                  </div>
                </ProfileSection>

                <ProfileSection title="Service categories">
                  {profile?.categories?.length ? (
                    <ul className="divide-y divide-gray-100">
                      {profile.categories.map((category) => (
                        <li
                          key={category.id}
                          className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                        >
                          <span className="font-medium text-gray-800">
                            {category.nameEn}
                          </span>
                          {category.nameSi && (
                            <span className="text-sm text-gray-500">
                              {category.nameSi}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {category.slug}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyValue>No service categories listed.</EmptyValue>
                  )}
                </ProfileSection>

                <ProfileSection title="Work experience">
                  {profile?.experiences?.length ? (
                    <div className="space-y-4">
                      {profile.experiences.map((experience) => (
                        <article
                          key={experience.id}
                          className="border-l-2 border-blue-100 pl-4"
                        >
                          <h3 className="font-medium text-gray-900">
                            {experience.jobTitle || "Experience"}
                          </h3>
                          {experience.companyName && (
                            <p className="mt-0.5 text-sm text-gray-600">
                              {experience.companyName}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            {formatDateRange(
                              experience.startDate,
                              experience.endDate,
                              experience.isCurrent,
                            )}
                          </p>
                          {experience.description && (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                              {experience.description}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <EmptyValue>No work experience listed.</EmptyValue>
                  )}
                </ProfileSection>

                <ProfileSection title="Education">
                  {profile?.education?.length ? (
                    <div className="space-y-4">
                      {profile.education.map((education) => (
                        <article
                          key={education.id}
                          className="border-l-2 border-gray-200 pl-4"
                        >
                          <h3 className="font-medium text-gray-900">
                            {education.qualification ||
                              education.description ||
                              "Education"}
                          </h3>
                          {education.institution && (
                            <p className="mt-0.5 text-sm text-gray-600">
                              {education.institution}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            {formatDateRange(
                              education.startDate,
                              education.endDate,
                            )}
                          </p>
                          {education.description && education.qualification && (
                            <p className="mt-2 text-sm text-gray-600">
                              {education.description}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <EmptyValue>No education details listed.</EmptyValue>
                  )}
                </ProfileSection>

                <ProfileSection title="Portfolio">
                  {profile?.portfolio?.length ? (
                    <div className="space-y-4">
                      {profile.portfolio.map((item) => (
                        <article
                          key={item.id}
                          className="border-l-2 border-gray-200 pl-4"
                        >
                          <h3 className="font-medium text-gray-900">
                            {item.title}
                          </h3>
                          {item.completedAt && (
                            <p className="mt-1 text-xs text-gray-500">
                              Completed {formatDate(item.completedAt)}
                            </p>
                          )}
                          {item.description && (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                              {item.description}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <EmptyValue>No portfolio items listed.</EmptyValue>
                  )}
                </ProfileSection>

                <ProfileSection title="Worker approval">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Approval status</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {formatStatus(profile?.approvalStatus)}
                      </p>
                    </div>
                    {!isApproved && (
                      <Button
                        type="button"
                        disabled
                        title="Approval action is not connected to an API yet"
                      >
                        Approve worker
                      </Button>
                    )}
                  </div>
                  {!isApproved && (
                    <p className="mt-3 text-xs text-gray-500">
                      Approval action is unavailable until the approval API is
                      configured.
                    </p>
                  )}
                </ProfileSection>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex min-w-0 gap-2.5">
      <span className="mt-0.5 shrink-0 text-gray-400">
        {icon && (
          <span className="block h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        )}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="break-words text-sm font-medium text-gray-900">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function EmptyValue({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

function formatLanguage(language: string) {
  const normalized = language.toUpperCase();
  if (normalized === "SI") return "Sinhala";
  if (normalized === "EN") return "English";
  return language || "Not provided";
}

function formatStatus(value: string | null | undefined) {
  if (!value) return "Not provided";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
  isCurrent?: boolean,
) {
  const start = startDate ? formatDate(startDate) : null;
  const end = isCurrent ? "Present" : endDate ? formatDate(endDate) : null;
  if (!start && !end) return "Dates not provided";
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
}
