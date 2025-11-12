"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardStatCard from "@/components/ui/statcard";
import {
  bookingStat,
  revenueStat,
  userStat,
  workerStat,
  revenueChart,
  jobCleaningService,
  recentBookings,
} from "@/services/overview/overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ["bookingStat"],
    queryFn: bookingStat,
  });

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["revenueStat"],
    queryFn: revenueStat,
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["userStat"],
    queryFn: userStat,
  });

  const { data: workerData, isLoading: isWorkerLoading } = useQuery({
    queryKey: ["workerStat"],
    queryFn: workerStat,
  });

  const { data: cleaningData, isLoading: isCleaningLoading } = useQuery({
    queryKey: ["cleaningService"],
    queryFn: jobCleaningService,
  });

  const { data: revenueChartData, isLoading: isRevenueChartLoading } = useQuery(
    {
      queryKey: ["revenueChart"],
      queryFn: revenueChart,
    }
  );

  const { data: recentBooking, isLoading: isRecentBookingsLoading } = useQuery({
    queryKey: ["recentBookings"],
    queryFn: recentBookings,
  });

  const cards = [
    {
      title: "Total Bookings",
      value: bookingData?.data?.totalBookings ?? 0,
      iconSrc: "/calendar.svg",
      growth: (bookingData?.data?.percentageChange ?? 0).toFixed(2) + "%",
      iconBg: "#E6FAF9",
      iconBorder: "#05CDC2",
      darkIconBg: "#0F2F2E",
      darkIconBorder: "#05CDC2",
      isLoading: isBookingLoading,
    },
    {
      title: "Total Revenue",
      value: `$${revenueData?.data?.totalRevenue ?? 0}`,
      iconSrc: "/recieve.svg",
      growth: (revenueData?.data?.percentageChange ?? 0).toFixed(2) + "%",
      iconBg: "#FFFBF3",
      iconBorder: "#FFDC89",
      darkIconBg: "#2E2610",
      darkIconBorder: "#FFDC89",
      isLoading: isRevenueLoading,
    },
    {
      title: "Total Users",
      value: userData?.data?.totalUsers ?? 0,
      iconSrc: "/user.svg",
      growth: (userData?.data?.percentageChange ?? 0).toFixed(2) + "%",
      iconBg: "#F9FDF6",
      iconBorder: "#C7E7A4",
      darkIconBg: "#1B2A11",
      darkIconBorder: "#C7E7A4",
      isLoading: isUserLoading,
    },
    {
      title: "Total Workers",
      value: workerData?.data?.totalWorkers ?? 0,
      iconSrc: "/team.svg",
      growth: (workerData?.data?.percentageChange ?? 0).toFixed(2) + "%",
      iconBg: "#FDFCFA",
      iconBorder: "#EADDCD",
      darkIconBg: "#2A2017",
      darkIconBorder: "#EADDCD",
      isLoading: isWorkerLoading,
    },
  ];

  // Process cleaning service data for charts
  const processCleaningData = () => {
    if (!cleaningData?.data) return [];

    const thisWeekData =
      cleaningData.data.thisWeek?.map((item: any) => ({
        date: `${item._id.month}/${item._id.day}`,
        completed: item.totalCompleted,
        type: "This Week",
      })) || [];

    const lastWeekData =
      cleaningData.data.lastWeek?.map((item: any) => ({
        date: `${item._id.month}/${item._id.day}`,
        completed: item.totalCompleted,
        type: "Last Week",
      })) || [];

    return [...thisWeekData, ...lastWeekData];
  };

  // Process revenue data for charts
  const processRevenueData = () => {
    if (!revenueChartData?.data) {
      return { monthlyRevenue: [], weeklyRevenue: [] };
    }

    const monthlyRevenue =
      revenueChartData.data.monthlyRevenue?.map((item: any) => ({
        month: `Month ${item._id.month}`,
        revenue: item.totalRevenue,
      })) || [];

    const weeklyRevenue =
      revenueChartData.data.weeklyRevenue?.map((item: any) => ({
        week: `Week ${item._id.week}`,
        revenue: item.totalRevenue,
      })) || [];

    return { monthlyRevenue, weeklyRevenue };
  };

  const cleaningChartData = processCleaningData();
  const revenueChartProcessed = processRevenueData();

  return (
    <div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card, index) => (
          <DashboardStatCard key={index} {...card} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-5">
        {/* Cleaning Chart */}
        <Card className="w-full overflow-x-auto">
          <CardHeader>
            <CardTitle>Cleaning Service Completion Rate</CardTitle>
            <CardDescription>
              {cleaningData?.data?.summary && (
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>
                    This Week: {cleaningData.data.summary.totalThisWeek}
                  </span>
                  <span>Growth: {cleaningData.data.summary.weeklyGrowth}</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ChartContainer
              config={{
                completed: {
                  label: "Completed Jobs",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart
                data={cleaningChartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="#6a41cc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="w-full overflow-x-auto">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly and weekly revenue trends</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
              }}
            >
              <LineChart
                data={revenueChartProcessed.monthlyRevenue}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-revenue)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="w-full overflow-x-auto">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              A list of the most recent bookings made on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 sm:p-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table className="min-w-[600px] md:min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Cleaners</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Charge</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {recentBooking?.data?.map((booking: any) => (
                      <TableRow
                        key={booking._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {booking.userId.fullName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {booking.userId.email}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {booking.userId.phoneNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {booking.services}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {booking.serviceType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{booking.cleaners}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {booking.time}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${booking.charge.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "pending"
                                ? "secondary"
                                : booking.status === "completed"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Page;
