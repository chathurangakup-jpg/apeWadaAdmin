"use client";

import { cn } from "@/lib/utils";
import { logoutUser } from "@/store/features/auth/authThunk";
import { useAppDispatch } from "@/store/hooks";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertTriangle,
  Briefcase,
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase, disabled: true },
  { href: "/workers", label: "Workers", icon: Wrench, disabled: true },
  { href: "/bookings", label: "Bookings", icon: Calendar, disabled: true },
  {
    href: "/cancellations",
    label: "Cancellations",
    icon: AlertTriangle,
    disabled: true,
  },
  { href: "/reviews", label: "Reviews", icon: Star, disabled: true },
  { href: "/settings", label: "Settings", icon: Settings, disabled: true },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    onMobileClose();
    await dispatch(logoutUser());
    router.push("/login");
  };

  const contents = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          AW
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">ApeWada</p>
          <p className="text-xs text-gray-500">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400"
                title="Coming soon"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {contents}
      </aside>

      <Dialog.Root
        open={mobileOpen}
        onOpenChange={(open) => {
          if (!open) onMobileClose();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col bg-white shadow-xl outline-none lg:hidden">
            <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
            <Dialog.Close
              aria-label="Close navigation menu"
              className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
            {contents}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
