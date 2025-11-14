"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Eye, UserPlus, Trash2 } from "lucide-react";

// components
import DashboardStatCard from "@/components/ui/statcard";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// API
import { bookingStat } from "@/services/overview/overview";
import {
  bookings,
  viewBooking,
  assignBooking,
  assignBookingToMultipleCleaners,
  deleteBooking,
} from "@/services/booking/bookings";
import { allCleaners } from "@/services/cleaners/cleaners";
import { Checkbox } from "@/components/ui/checkbox";

const BookingPage = () => {
  const queryClient = useQueryClient();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCleanerId, setSelectedCleanerId] = useState<string>("");
  const [isMultiAssignDialogOpen, setIsMultiAssignDialogOpen] = useState(false);
  const [selectedBookingForMulti, setSelectedBookingForMulti] = useState("");
  const [selectedCleanerIds, setSelectedCleanerIds] = useState<string[]>([]);

  const { data: bookingStats, isLoading: isBookingStatsLoading } = useQuery({
    queryKey: ["bookingStat"],
    queryFn: bookingStat,
  });

  const { data: recentBookings, isLoading: isRecentBookingsLoading } = useQuery(
    {
      queryKey: ["bookings"],
      queryFn: bookings,
    }
  );

  const { data: cleaners, isLoading: isAllCleanersLoading } = useQuery({
    queryKey: ["cleaners"],
    queryFn: allCleaners,
  });

  const { data: bookingDetails, isLoading: isBookingDetailsLoading } = useQuery(
    {
      queryKey: ["viewBooking", selectedBookingId],
      queryFn: () => viewBooking(selectedBookingId),
      enabled: !!selectedBookingId && isViewDialogOpen,
    }
  );

  const assignMutation = useMutation({
    mutationFn: ({
      bookingId,
      cleanerId,
    }: {
      bookingId: string;
      cleanerId: string;
    }) => assignBooking(bookingId, cleanerId),
    onSuccess: () => {
      toast.success("Cleaner assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsAssignDialogOpen(false);
      setSelectedCleanerId("");
      setSelectedBookingId(null);
    },
    onError: (error: any) => {
      toast.error(error || "Failed to assign cleaner");
    },
  });

  const assignMultipleMutation = useMutation({
    mutationFn: ({
      bookingId,
      cleanerIds,
    }: {
      bookingId: string;
      cleanerIds: string[];
    }) =>
      assignBookingToMultipleCleaners({
        bookingId,
        workerIds: cleanerIds,
      }),

    onSuccess: (data) => {
      toast.success(data?.message || "Cleaners assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsMultiAssignDialogOpen(false);
      setSelectedBookingForMulti("");
      setSelectedCleanerIds([]);
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bookingId: string) => deleteBooking(bookingId),
    onSuccess: () => {
      toast.success("Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsDeleteDialogOpen(false);
      setSelectedBookingId(null);
    },
    onError: (error: any) => {
      toast.error(error || "Failed to delete booking");
    },
  });

  const cards = [
    {
      title: "Total Bookings",
      value: bookingStats?.data?.totalBookings ?? 0,
      iconSrc: "/calendar.svg",
      growth: (bookingStats?.data?.percentageChange ?? 0).toFixed(2) + "%",
      iconBg: "#E6FAF9",
      iconBorder: "#05CDC2",
      darkIconBg: "#0F2F2E",
      darkIconBorder: "#05CDC2",
      isLoading: isBookingStatsLoading,
    },
  ];

  const handleViewBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsViewDialogOpen(true);
  };

  const handleAssignCleaner = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsAssignDialogOpen(true);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsDeleteDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!selectedBookingId || !selectedCleanerId) {
      toast.error("Please select a cleaner");
      return;
    }
    assignMutation.mutate({
      bookingId: selectedBookingId,
      cleanerId: selectedCleanerId,
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedBookingId) {
      deleteMutation.mutate(selectedBookingId);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4">
          {cards.map((card, index) => (
            <DashboardStatCard key={index} {...card} />
          ))}
        </section>

        <div className="flex justify-end">
          <Button onClick={() => setIsMultiAssignDialogOpen(true)}>
            Assign Multiple Cleaners
          </Button>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <section>
        <Card className="w-full overflow-x-auto">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              A list of all bookings made on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 sm:p-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead className="min-w-[120px]">Service</TableHead>
                      <TableHead className="min-w-20">Cleaners</TableHead>
                      <TableHead className="min-w-[120px]">
                        Date & Time
                      </TableHead>
                      <TableHead className="min-w-20">Charge</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[60px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings?.data?.map((booking: any) => (
                      <TableRow
                        key={booking._id}
                        className=" transition-colors"
                      >
                        {/* User Info */}
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="font-medium text-xs md:text-sm">
                              {booking.userId.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {booking.userId.email}
                            </span>
                          </div>
                        </TableCell>

                        {/* Service */}
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="font-medium capitalize text-xs md:text-sm">
                              {booking.serviceType}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {booking.services}
                            </span>
                          </div>
                        </TableCell>

                        {/* Cleaners */}
                        <TableCell className="text-xs md:text-sm">
                          {booking.cleaners}
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs md:text-sm">
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {booking.time}
                            </span>
                          </div>
                        </TableCell>

                        {/* Charge */}
                        <TableCell className="text-xs md:text-sm font-medium">
                          ${booking.charge.toFixed(2)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "pending"
                                ? "secondary"
                                : booking.status === "completed"
                                ? "success"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
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
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleViewBooking(booking._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAssignCleaner(booking._id)}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign Cleaner
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteBooking(booking._id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Booking
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
          </CardContent>
        </Card>
      </section>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>

          {isBookingDetailsLoading ? (
            <div className="flex items-center justify-center py-8">
              {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
              <Spinner />
            </div>
          ) : bookingDetails?.data ? (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">
                      {bookingDetails.data.userId.fullName}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">
                      {bookingDetails.data.userId.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">
                      {bookingDetails.data.userId.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium">
                      {bookingDetails.data.userId.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Booking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reference:</span>
                    <p className="font-medium">
                      {bookingDetails.data.bookingReference}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Service Type:</span>
                    <p className="font-medium capitalize">
                      {bookingDetails.data.serviceType}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Service:</span>
                    <p className="font-medium">
                      {bookingDetails.data.services}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Number of Cleaners:
                    </span>
                    <p className="font-medium">
                      {bookingDetails.data.cleaners}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">
                      {new Date(bookingDetails.data.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <p className="font-medium">{bookingDetails.data.time}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">
                      {bookingDetails.data.duration}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <p className="font-medium capitalize">
                      {bookingDetails.data.frequency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Location */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Service Location
                </h3>
                <div className="text-sm">
                  <span className="text-muted-foreground">Address:</span>
                  <p className="font-medium">{bookingDetails.data.address}</p>
                </div>
              </div>

              {/* Special Instructions */}
              {bookingDetails.data.specialInstructions && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Special Instructions
                  </h3>
                  <p className="text-sm">
                    {bookingDetails.data.specialInstructions}
                  </p>
                </div>
              )}

              {/* Payment & Status */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Payment & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Charge:</span>
                    <p className="font-medium text-lg">
                      ${bookingDetails.data.charge.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>
                    <p className="font-medium">
                      <Badge
                        variant={
                          bookingDetails.data.isPaid ? "success" : "secondary"
                        }
                      >
                        {bookingDetails.data.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Booking Status:
                    </span>
                    <p className="font-medium">
                      <Badge
                        variant={
                          bookingDetails.data.status === "pending"
                            ? "secondary"
                            : bookingDetails.data.status === "completed"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {bookingDetails.data.status.charAt(0).toUpperCase() +
                          bookingDetails.data.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Assignment Status:
                    </span>
                    <p className="font-medium">
                      <Badge
                        variant={
                          bookingDetails.data.isAssigned
                            ? "success"
                            : "secondary"
                        }
                      >
                        {bookingDetails.data.isAssigned
                          ? "Assigned"
                          : "Unassigned"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No booking details found
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Cleaner Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Cleaner to Booking</DialogTitle>
            <DialogDescription>
              Select a cleaner to assign to this booking
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Cleaner</label>
              <Select
                value={selectedCleanerId}
                onValueChange={setSelectedCleanerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a cleaner..." />
                </SelectTrigger>
                <SelectContent>
                  {cleaners?.data?.map((cleaner: any) => (
                    <SelectItem key={cleaner._id} value={cleaner._id}>
                      <div className="flex flex-col">
                        <span className="font-medium text-start">
                          {cleaner.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {cleaner.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCleanerId && cleaners?.data && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">
                  Selected Cleaner Details
                </h4>
                {(() => {
                  const cleaner = cleaners.data.find(
                    (c: any) => c._id === selectedCleanerId
                  );
                  return cleaner ? (
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {cleaner.fullName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {cleaner.phoneNumber}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Experience:
                        </span>{" "}
                        {cleaner.workExperience?.[0]?.yearOfExperience || "N/A"}{" "}
                        years
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignDialogOpen(false);
                setSelectedCleanerId("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={!selectedCleanerId || assignMutation.isPending}
            >
              {assignMutation.isPending ? <Spinner /> : "Assign Cleaner"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isMultiAssignDialogOpen}
        onOpenChange={setIsMultiAssignDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Multiple Cleaners</DialogTitle>
            <DialogDescription>
              Select a booking and assign multiple cleaners
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Select Booking */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Booking</label>
              <Select
                value={selectedBookingForMulti}
                onValueChange={setSelectedBookingForMulti}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a booking..." />
                </SelectTrigger>
                <SelectContent>
                  {recentBookings?.data?.map((booking: any) => (
                    <SelectItem key={booking._id} value={booking._id}>
                      {booking.userId.fullName} - {booking.serviceType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Cleaners</label>

              <Command className="border rounded-md">
                <CommandInput placeholder="Search cleaners..." />

                <CommandList className="max-h-60 overflow-y-auto">
                  <CommandEmpty>No cleaner found.</CommandEmpty>

                  <CommandGroup>
                    {cleaners?.data?.map((cleaner: any) => {
                      const isSelected = selectedCleanerIds.includes(
                        cleaner._id
                      );

                      return (
                        <CommandItem
                          key={cleaner._id}
                          onSelect={() => {
                            setSelectedCleanerIds((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== cleaner._id)
                                : [...prev, cleaner._id]
                            );
                          }}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {cleaner.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {cleaner.email}
                            </span>
                          </div>

                          <Checkbox checked={isSelected} />

                          {/* <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4 w-4 rounded border-gray-300"
                          /> */}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsMultiAssignDialogOpen(false);
                setSelectedBookingForMulti("");
                setSelectedCleanerIds([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                assignMultipleMutation.mutate({
                  bookingId: selectedBookingForMulti,
                  cleanerIds: selectedCleanerIds,
                })
              }
              disabled={
                !selectedBookingForMulti ||
                selectedCleanerIds.length === 0 ||
                assignMultipleMutation.isPending
              }
            >
              {assignMultipleMutation.isPending ? (
                <Spinner />
              ) : (
                "Assign Cleaners"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              booking from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner /> : "Delete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingPage;
