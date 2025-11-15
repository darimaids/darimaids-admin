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

// For Word document generation
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableCell as DocxTableCell,
  TableRow as DocxTableRow,
  HeadingLevel,
  AlignmentType,
  TextRun,
} from "docx";
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

  // Export to Word function
  const exportToWord = async () => {
    if (!completedDisbursements?.length) return;

    try {
      // Create table headers
      const tableHeaders = new DocxTableRow({
        children: [
          new DocxTableCell({
            children: [
              new Paragraph({ text: "Cleaner", alignment: AlignmentType.LEFT }),
            ],
          }),
          new DocxTableCell({
            children: [
              new Paragraph({ text: "Service", alignment: AlignmentType.LEFT }),
            ],
          }),
          new DocxTableCell({
            children: [
              new Paragraph({ text: "Amount", alignment: AlignmentType.RIGHT }),
            ],
          }),
          new DocxTableCell({
            children: [
              new Paragraph({
                text: "Booking Ref",
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
          new DocxTableCell({
            children: [
              new Paragraph({ text: "Status", alignment: AlignmentType.LEFT }),
            ],
          }),
          new DocxTableCell({
            children: [
              new Paragraph({ text: "Bank", alignment: AlignmentType.LEFT }),
            ],
          }),
          new DocxTableCell({
            children: [
              new Paragraph({
                text: "Account Number",
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
        ],
      });

      // Create table rows from data
      const tableRows = completedDisbursements.map(
        (item: any) =>
          new DocxTableRow({
            children: [
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: `${item.workerInfo.fullName}\n${item.workerInfo.phoneNumber}`,
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: `${formatServiceName(
                      item.cleanerInfo.bookingId.serviceType ||
                        item.cleanerInfo.bookingId.services
                    )}\n${item.cleanerInfo.bookingId.services}`,
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: `$${item.workerInfo.wallet || 0}`,
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: item.cleanerInfo.bookingId.bookingReference,
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: item.cleanerInfo.status,
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: item.bankDetails?.bankName || "No bank",
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new DocxTableCell({
                children: [
                  new Paragraph({
                    text: item.bankDetails?.accountNumber?.toString() || "N/A",
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
            ],
          })
      );

      // Create the document
      const doc = new Document({
        sections: [
          {
            children: [
              // Header with title and date
              new Paragraph({
                text: "DARIMAIDS",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              new Paragraph({
                text: "Disbursements Report",
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generated on: ${new Date().toLocaleDateString()}`,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              new Paragraph({
                text: `Total Records: ${completedDisbursements.length}`,
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 },
              }),

              // Table
              new DocxTable({
                width: { size: 100, type: "pct" },
                rows: [tableHeaders, ...tableRows],
              }),

              // Footer with summary
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: "Summary",
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 400, after: 200 },
              }),
              new Paragraph({
                text: `Total Amount: $${completedDisbursements.reduce(
                  (total: number, item: any) =>
                    total + (item.workerInfo.wallet || 0),
                  0
                )}`,
                spacing: { after: 100 },
              }),
            ],
          },
        ],
      });

      // Generate the document and trigger download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `darimaid-disbursements-${
        new Date().toISOString().split("T")[0]
      }.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Error generating Word document:", error);
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
              onClick={exportToWord}
              className="flex items-center gap-2"
              disabled={isLoading || !completedDisbursements?.length}
            >
              <Download className="w-4 h-4" />
              Export to Word
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
