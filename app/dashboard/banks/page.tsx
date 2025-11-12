"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Eye } from "lucide-react";
import { toast } from "sonner";

// components
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import DashboardStatCard from "@/components/ui/statcard";

// API
import { allBanks, viewBankInformation } from "@/services/banks/banks";
import { workerStat } from "@/services/overview/overview";

const Banks = () => {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: banksData, isLoading: isBanksLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: allBanks,
  });

  // Fetch single bank details
  const { data: bankDetails, isLoading: isBankDetailsLoading } = useQuery({
    queryKey: ["viewBankInformation", selectedBankId],
    queryFn: () => viewBankInformation(selectedBankId),
    enabled: !!selectedBankId && isViewDialogOpen,
  });

  const handleViewBank = (bankId: string) => {
    setSelectedBankId(bankId);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Banks Table */}
      <section>
        <Card className="w-full overflow-x-auto">
          <CardHeader>
            <CardTitle>All Banks</CardTitle>
            <CardDescription>Workers Bank Information</CardDescription>
          </CardHeader>
          <CardContent className="px-8 sm:p-6">
            {isBanksLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">
                          Bank Name
                        </TableHead>
                        <TableHead className="min-w-[200px]">
                          Account Name
                        </TableHead>
                        <TableHead className="min-w-[150px]">
                          Account Number
                        </TableHead>
                        <TableHead className="min-w-[180px]">
                          Date Added
                        </TableHead>
                        <TableHead className="min-w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banksData?.data?.length > 0 ? (
                        banksData.data.map((bank: any) => (
                          <TableRow
                            key={bank._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <TableCell className="text-sm font-medium">
                              {bank.bankName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {bank.accountName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {bank.accountNumber}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(bank.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleViewBank(bank._id)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No banks found
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

      {/* View Bank Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bank Details</DialogTitle>
            <DialogDescription>Information about this bank.</DialogDescription>
          </DialogHeader>

          {isBankDetailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : bankDetails?.data ? (
            <div className="space-y-4 text-sm">
              <p>
                <span className="text-muted-foreground">Bank Name:</span>{" "}
                {bankDetails.data.bankName}
              </p>
              <p>
                <span className="text-muted-foreground">Account Name:</span>{" "}
                {bankDetails.data.accountName}
              </p>
              <p>
                <span className="text-muted-foreground">Account Number:</span>{" "}
                {bankDetails.data.accountNumber}
              </p>
              <p>
                <span className="text-muted-foreground">Created At:</span>{" "}
                {new Date(bankDetails.data.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="text-muted-foreground">Updated At:</span>{" "}
                {new Date(bankDetails.data.updatedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No bank details found
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Banks;
