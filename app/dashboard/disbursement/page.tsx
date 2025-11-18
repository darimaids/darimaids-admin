"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// API
import { getDisbursement } from "@/services/disbursement/disbursement";

// For Excel export
import * as XLSX from "xlsx";
import { toast } from "sonner";

const Disbursement = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["disbursements"],
    queryFn: getDisbursement,
  });

  // Filter only completed items
  const completedDisbursements =
    data?.data?.filter(
      (item: any) => item.cleanerInfo?.status === "completed"
    ) || [];

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "success";
      case "pending":
        return "secondary";
      case "cancelled":
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format service name
  const formatServiceName = (service: string) => {
    return service.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Export to Excel function
  const exportToExcel = async () => {
    if (!completedDisbursements?.length) return;

    try {
      // Prepare data for Excel
      const excelData = completedDisbursements.map((item: any) => ({
        "Cleaner Name": item.workerInfo.fullName,
        "Phone Number": item.workerInfo.phoneNumber,
        "Service Type": formatServiceName(
          item.cleanerInfo.bookingId.serviceType ||
            item.cleanerInfo.bookingId.services
        ),
        "Service Details": item.cleanerInfo.bookingId.services,
        "Amount ($)": item.workerInfo.wallet || 0,
        "Booking Reference": item.cleanerInfo.bookingId.bookingReference,
        Status: item.cleanerInfo.status,
        "Bank Name": item.bankDetails?.bankName || "No bank",
        "Account Number": item.bankDetails?.accountNumber?.toString() || "N/A",
      }));

      // Calculate total amount
      const totalAmount = completedDisbursements.reduce(
        (total: number, item: any) => total + (item.workerInfo.wallet || 0),
        0
      );

      // Add summary rows
      const summaryData = [
        {},
        {
          "Cleaner Name": "SUMMARY",
          "Phone Number": "",
          "Service Type": "",
          "Service Details": "",
          "Amount ($)": "",
          "Booking Reference": "",
          Status: "",
          "Bank Name": "",
          "Account Number": "",
        },
        {
          "Cleaner Name": "Total Records:",
          "Phone Number": completedDisbursements.length,
          "Service Type": "",
          "Service Details": "",
          "Amount ($)": "",
          "Booking Reference": "",
          Status: "",
          "Bank Name": "",
          "Account Number": "",
        },
        {
          "Cleaner Name": "Total Amount:",
          "Phone Number": `$${totalAmount}`,
          "Service Type": "",
          "Service Details": "",
          "Amount ($)": "",
          "Booking Reference": "",
          Status: "",
          "Bank Name": "",
          "Account Number": "",
        },
        {
          "Cleaner Name": "Generated on:",
          "Phone Number": new Date().toLocaleDateString(),
          "Service Type": "",
          "Service Details": "",
          "Amount ($)": "",
          "Booking Reference": "",
          Status: "",
          "Bank Name": "",
          "Account Number": "",
        },
      ];

      // Combine data
      const finalData = [...excelData, ...summaryData];

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(finalData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 20 }, // Cleaner Name
        { wch: 15 }, // Phone Number
        { wch: 20 }, // Service Type
        { wch: 20 }, // Service Details
        { wch: 12 }, // Amount
        { wch: 18 }, // Booking Reference
        { wch: 12 }, // Status
        { wch: 20 }, // Bank Name
        { wch: 18 }, // Account Number
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursements");

      // Generate file name with date
      const fileName = `darimaid-disbursements-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Write file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error generating export file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <Card className="w-full overflow-x-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Disbursements</CardTitle>
              <CardDescription>
                Completed Worker Payments - Booking and Bank Information
              </CardDescription>
            </div>
            <Button
              onClick={exportToExcel}
              className="flex items-center gap-2"
              disabled={isLoading || !completedDisbursements?.length}
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
          </CardHeader>
          <CardContent className="px-8 sm:p-6">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Cleaner</TableHead>
                        <TableHead className="min-w-[120px]">Service</TableHead>
                        <TableHead className="min-w-[100px]">Amount</TableHead>
                        <TableHead className="min-w-[140px]">
                          Booking Ref
                        </TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Bank</TableHead>
                        <TableHead className="min-w-[120px]">
                          Account Number
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedDisbursements.length > 0 ? (
                        completedDisbursements.map((item: any) => (
                          <TableRow key={item.cleanerInfo._id} className="">
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">
                                  {item.workerInfo.fullName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.workerInfo.phoneNumber}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm capitalize">
                                {formatServiceName(
                                  item.cleanerInfo.bookingId.serviceType ||
                                    item.cleanerInfo.bookingId.services
                                )}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {item.cleanerInfo.bookingId.services}
                              </p>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              {`$${item.workerInfo.wallet || 0}`}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {item.cleanerInfo.bookingId.bookingReference}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusVariant(
                                  item.cleanerInfo.status
                                )}
                                className="text-xs"
                              >
                                {item.cleanerInfo.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {item.bankDetails?.bankName || "No bank"}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm font-mono">
                                {item.bankDetails?.accountNumber || "N/A"}
                              </code>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No completed disbursements found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Disbursement;

const TableSkeleton = () => {
  return (
    <div className="mt-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="grid grid-cols-5 gap-4 py-4 border-b last:border-0"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
};
