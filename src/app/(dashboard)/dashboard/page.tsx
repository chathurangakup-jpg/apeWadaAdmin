// src/app/(dashboard)/dashboard/page.tsx
import { Briefcase, Calendar, Users, Wrench } from "lucide-react";

const stats = [
  {
    label: "Total Customers",
    value: "—",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Active Jobs",
    value: "—",
    icon: Briefcase,
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    label: "Approved Workers",
    value: "—",
    icon: Wrench,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Scheduled Bookings",
    value: "—",
    icon: Calendar,
    color: "text-orange-600 bg-orange-50",
  },
];

export default async function DashboardPage() {
  // const { cookies } = await import("next/headers");

  // const cookieStore = await cookies();
  // const token = cookieStore.get("apewada_admin_token")?.value;

  // if (!token) {
  //   redirect("/login");
  // }

  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of the ApeWada platform
        </p>
      </div> */}

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">
            Welcome to ApeWada Admin
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Use the sidebar to navigate. The <strong>Customers</strong> section
            is now available.
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
}
