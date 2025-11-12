"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// API
import {
  allCleaners,
  deleteCleaner,
  viewCleaner,
} from "@/services/cleaners/cleaners";
import { workerStat } from "@/services/overview/overview";
import DashboardStatCard from "@/components/ui/statcard";

const CleanersPage = () => {
  const queryClient = useQueryClient();
  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: workerData, isLoading: isWorkerLoading } = useQuery({
    queryKey: ["workerStat"],
    queryFn: workerStat,
  });

  // Fetch all cleaners
  const { data: cleanersData, isLoading: isCleanersLoading } = useQuery({
    queryKey: ["cleaners"],
    queryFn: allCleaners,
  });

  // Fetch single cleaner details
  const { data: cleanerDetails, isLoading: isCleanerDetailsLoading } = useQuery(
    {
      queryKey: ["viewCleaner", selectedCleanerId],
      queryFn: () => viewCleaner(selectedCleanerId),
      enabled: !!selectedCleanerId && isViewDialogOpen,
    }
  );

  // Delete cleaner mutation
  const deleteMutation = useMutation({
    mutationFn: (cleanerId: string) => deleteCleaner(cleanerId),
    onSuccess: () => {
      toast.success("Cleaner deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["cleaners"] });
      setIsDeleteDialogOpen(false);
      setSelectedCleanerId(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete cleaner");
    },
  });

  const handleViewCleaner = (cleanerId: string) => {
    setSelectedCleanerId(cleanerId);
    setIsViewDialogOpen(true);
  };

  const handleDeleteCleaner = (cleanerId: string) => {
    setSelectedCleanerId(cleanerId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCleanerId) {
      deleteMutation.mutate(selectedCleanerId);
    }
  };

  const cards = [
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

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4">
        {cards.map((card, index) => (
          <DashboardStatCard key={index} {...card} />
        ))}
      </section>
      {/* Cleaners Table */}
      <section>
        <Card className="w-full overflow-x-auto">
          <CardHeader>
            <CardTitle>All Cleaners</CardTitle>
            <CardDescription>
              List of all cleaners on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 sm:p-6">
            {isCleanersLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[120px]">Phone</TableHead>
                        <TableHead className="min-w-[100px]">Gender</TableHead>
                        <TableHead className="min-w-[150px]">
                          Experience
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          Verified
                        </TableHead>
                        <TableHead className="min-w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cleanersData?.data?.map((cleaner: any) => (
                        <TableRow
                          key={cleaner._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          {/* Cleaner Info */}
                          <TableCell className="flex items-center gap-3">
                            <img
                              src={
                                cleaner.image ||
                                "https://via.placeholder.com/40x40.png?text=C"
                              }
                              alt={cleaner.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {cleaner.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {cleaner.address}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="text-sm">
                            {cleaner.email}
                          </TableCell>
                          <TableCell className="text-sm">
                            {cleaner.phoneNumber}
                          </TableCell>
                          <TableCell className="text-sm">
                            {cleaner.gender}
                          </TableCell>
                          <TableCell className="text-sm">
                            {cleaner.workExperience?.[0]?.yearOfExperience ||
                              "N/A"}{" "}
                            yrs
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                cleaner.isVerified ? "success" : "secondary"
                              }
                              className="text-xs"
                            >
                              {cleaner.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>

                          {/* Actions */}
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
                                  onClick={() => handleViewCleaner(cleaner._id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Cleaner
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteCleaner(cleaner._id)
                                  }
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Cleaner
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* View Cleaner Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cleaner Details</DialogTitle>
            <DialogDescription>
              Information about this cleaner.
            </DialogDescription>
          </DialogHeader>

          {isCleanerDetailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : cleanerDetails?.data ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    cleanerDetails.data.image ||
                    "https://via.placeholder.com/80x80.png?text=C"
                  }
                  alt={cleanerDetails.data.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {cleanerDetails.data.fullName}
                  </h3>
                  <Badge
                    variant={
                      cleanerDetails.data.isVerified ? "success" : "secondary"
                    }
                  >
                    {cleanerDetails.data.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {cleanerDetails.data.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {cleanerDetails.data.phoneNumber}
                </p>
                <p>
                  <span className="text-muted-foreground">Gender:</span>{" "}
                  {cleanerDetails.data.gender}
                </p>
                <p>
                  <span className="text-muted-foreground">DOB:</span>{" "}
                  {cleanerDetails.data.dateOfBirth}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {cleanerDetails.data.address}
                </p>
              </div>

              {/* Experience Section */}
              {cleanerDetails.data.workExperience?.[0] && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Work Experience
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Experience:</span>{" "}
                      {cleanerDetails.data.workExperience[0].yearOfExperience}{" "}
                      years
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        Preferred Service:
                      </span>{" "}
                      {cleanerDetails.data.workExperience[0].preferredService}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Work Area:</span>{" "}
                      {cleanerDetails.data.workExperience[0].preferredWorkArea}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        Availability:
                      </span>{" "}
                      {cleanerDetails.data.workExperience[0].availability}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Bio:</span>{" "}
                      {cleanerDetails.data.workExperience[0].shortBio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No cleaner details found
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              cleaner from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner /> : "Delete Cleaner"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CleanersPage;
