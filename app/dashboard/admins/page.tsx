"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Ban, Plus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Alert Dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// API
import { allAdmins, blockAdminAccount } from "@/services/admins/admins";
import Link from "next/link";

const AdminsPage = () => {
  const queryClient = useQueryClient();
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["allAdmins"],
    queryFn: allAdmins,
  });

  const blockMutation = useMutation({
    mutationFn: (adminId: string) => blockAdminAccount(adminId),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Status updated!");
      queryClient.invalidateQueries({ queryKey: ["allAdmins"] });
    },
    onError: (err: any) => {
      toast.error(err || "Failed to update admin status");
    },
  });

  const filteredAdmins = data?.data?.filter((admin: any) =>
    ["admin", "superAdmin"].includes(admin.role)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manage Admins</h1>

        <Link href="/dashboard/admins/create">
          <Button className="bg-[#6A4AAD] text-white hover:bg-[#58399b]">
            <Plus className="w-4 h-4 mr-2" />
            Create New Admin
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>List of admin users</CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAdmins?.map((admin: any) => (
                  <TableRow key={admin._id}>
                    <TableCell>{admin.fullName}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phoneNumber}</TableCell>
                    <TableCell className="capitalize">
                      {admin.address}
                    </TableCell>

                    <TableCell className="capitalize">{admin.role}</TableCell>

                    <TableCell>
                      <Badge
                        variant={admin.isBlocked ? "destructive" : "success"}
                      >
                        {admin.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={admin.isVerified ? "success" : "destructive"}
                      >
                        {admin.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => setSelectedAdmin(admin)}
                                className="text-red-600"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                {admin.isBlocked
                                  ? "Unblock Admin"
                                  : "Block Admin"}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Alert Dialog Content */}
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {selectedAdmin?.isBlocked
                                ? "Unblock Admin?"
                                : "Block Admin?"}
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              {selectedAdmin?.isBlocked
                                ? `This will restore access for ${selectedAdmin?.fullName}.`
                                : `This will block ${selectedAdmin?.fullName} from accessing the system.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={blockMutation.isPending}
                            >
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-500 flex gap-2"
                              onClick={() =>
                                blockMutation.mutate(selectedAdmin?._id)
                              }
                              disabled={blockMutation.isPending}
                            >
                              {blockMutation.isPending
                                ? "Processing..."
                                : selectedAdmin?.isBlocked
                                ? "Unblock"
                                : "Block"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}

                {!filteredAdmins?.length && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminsPage;

const TableSkeleton = () => {
  return (
    <div className="mt-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 py-4 border-b last:border-0"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
};
