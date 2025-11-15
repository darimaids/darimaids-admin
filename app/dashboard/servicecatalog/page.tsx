"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Pencil, Trash2, Plus } from "lucide-react";

import {
  getServices,
  editService,
  deleteSService,
} from "@/services/catalog/serviceCatalog";

import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface CatalogItem {
  _id: string;
  serviceName: string;
  description: string;
  serviceType: string[];
  prices: string[];
}

interface CatalogResponse {
  success: boolean;
  count: number;
  catalogs: CatalogItem[];
}

const AdminServicesPage = () => {
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<CatalogResponse>({
    queryKey: ["admin-services"],
    queryFn: getServices,
  });

  const catalogs = data?.catalogs ?? [];

  const editMutation = useMutation({
    mutationFn: async (updated: CatalogItem) =>
      await editService(updated._id, updated),
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setEditOpen(false);
    },
    onError: (err: any) => toast.error(err),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSService(id),
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err),
  });

  return (
    <div className="sm:p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manage Services</h1>

        <Link href="/dashboard/servicecatalog/create">
          <Button className="bg-[#6A4AAD] text-white hover:bg-[#58399b]">
            <Plus className="w-4 h-4 mr-2" />
            Create New Service
          </Button>
        </Link>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border min-h-[520px]"
            >
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <Skeleton className="h-4 w-4/5 mb-2" />
              <Skeleton className="h-4 w-3/5 mb-2" />
            </div>
          ))}

        {!isLoading &&
          catalogs.map((service) => (
            <div
              key={service._id}
              className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 hover:shadow-md transition flex flex-col justify-between min-h-[520px] border border-gray-100 dark:border-[#2E2E2E]"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  {service.serviceName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-4 mb-4">
                  {service.description}
                </p>

                {service.serviceType.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start mb-2">
                    <Check className="text-[#409261] mt-1 w-4 h-4 shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {item}
                    </p>
                  </div>
                ))}

                <div className="mt-5">
                  {service.prices.map((item, idx) => {
                    const [label, price] = item.split("=").map((p) => p.trim());
                    return (
                      <div
                        key={idx}
                        className="text-[#6A4AAD] dark:text-[#B9A8E4] font-medium text-sm sm:text-base flex justify-between"
                      >
                        <span>{label}</span>
                        <span>{price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-4 border-t">
                <Button
                  variant="outline"
                  className="flex gap-2  w-[48%]"
                  onClick={() => {
                    setSelected(service);
                    setEditOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  className="flex gap-2 w-[48%]"
                  onClick={() => setDeleteId(service._id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              {/* NAME */}
              <div>
                <label className="block mb-2 font-medium">Service Name</label>
                <Input
                  value={selected.serviceName}
                  onChange={(e) =>
                    setSelected({ ...selected, serviceName: e.target.value })
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <Textarea
                  rows={3}
                  value={selected.description}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                />
              </div>

              {/* SERVICE TYPES */}
              <div>
                <label className="block mb-2 font-medium">Service Type</label>
                {selected.serviceType.map((item, idx) => (
                  <Input
                    key={idx}
                    className="mb-2"
                    value={item}
                    onChange={(e) => {
                      const arr = [...selected.serviceType];
                      arr[idx] = e.target.value;
                      setSelected({ ...selected, serviceType: arr });
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setSelected({
                      ...selected,
                      serviceType: [...selected.serviceType, ""],
                    })
                  }
                >
                  Add item
                </Button>
              </div>

              {/* PRICES */}
              <div>
                <label className="block mb-2 font-medium">Prices</label>
                {selected.prices.map((item, idx) => (
                  <Input
                    key={idx}
                    className="mb-2"
                    value={item}
                    onChange={(e) => {
                      const arr = [...selected.prices];
                      arr[idx] = e.target.value;
                      setSelected({ ...selected, prices: arr });
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setSelected({
                      ...selected,
                      prices: [...selected.prices, ""],
                    })
                  }
                >
                  Add price
                </Button>
              </div>

              <DialogFooter>
                <Button
                  className="bg-[#6A4AAD] text-white"
                  disabled={editMutation.isPending}
                  onClick={() => selected && editMutation.mutate(selected)}
                >
                  {editMutation.isPending ? <Spinner /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-sm">
            This action cannot be undone. This will permanently delete the
            service.
          </p>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-500 flex gap-2"
              disabled={deleteMutation.isPending}
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              {deleteMutation.isPending ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServicesPage;
