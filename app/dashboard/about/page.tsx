"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { MoreVertical, Pencil, Trash2, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

// API
import { getAbout, editAbout, deleteAbout } from "@/services/about/about";

interface AboutItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  openTime: string;
  closingTime: string;
  createdAt: string;
  updatedAt: string;
}

interface AboutResponse {
  success: boolean;
  data: AboutItem[];
}

const AdminAboutPage = () => {
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<AboutItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<AboutItem | null>(null);


  const { data, isLoading } = useQuery<AboutResponse>({
    queryKey: ["about"],
    queryFn: getAbout,
  });

  const aboutItems = data?.data ?? [];

  const editMutation = useMutation({
    mutationFn: async (updated: AboutItem) =>
      await editAbout(updated._id, updated),
    onSuccess: () => {
      toast.success("About Us updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["about"] });
      setEditOpen(false);
    },
    onError: (err: any) => toast.error(err),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAbout(id),
    onSuccess: () => {
      toast.success("About Us deleted");
      queryClient.invalidateQueries({ queryKey: ["about"] });
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err),
  });

  return (
    <div className="sm:p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manage About Us</h1>

        <Link href="/dashboard/about/create">
          <Button className="bg-[#6A4AAD] text-white hover:bg-[#58399b]">
            <Plus className="w-4 h-4 mr-2" />
            Create New About
          </Button>
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1E1E] border rounded-xl p-4 flex justify-between"
            >
              <div className="w-full">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-6 w-6 ml-4" />
            </div>
          ))}

        {!isLoading &&
          aboutItems.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-[#1E1E1E] border rounded-xl p-5 hover:shadow transition"
            >
              {/* TITLE */}
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>

              {/* DESCRIPTION PREVIEW */}
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
                {item.description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                </span>

                {/* MENU */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      aria-label="actions"
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                    >
                      <MoreVertical />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent align="end" className="w-40 p-1">
                    <button
                      className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      onClick={() => {
                        setViewData(item);
                        setViewOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    <button
                      className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      onClick={() => {
                        setSelected(item);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-2 p-2 w-full text-red-500 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      onClick={() => setDeleteId(item._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
      </div>

      {/* VIEW MODAL */}
      {/* VIEW MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {viewData?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-3">
            {/* Description */}
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {viewData?.description}
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {viewData?.location}
              </p>
            </div>

            {/* Open Time */}
            <div>
              <h3 className="font-medium">Open Time</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {viewData?.openTime}
              </p>
            </div>

            {/* Closing Time */}
            <div>
              <h3 className="font-medium">Closing Time</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {viewData?.closingTime}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit About Us</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <Input
                  value={selected.title}
                  onChange={(e) =>
                    setSelected({ ...selected, title: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <Textarea
                  rows={5}
                  value={selected.description}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                />
              </div>

              {/* Location */}
              <div>
                <label className="block mb-2 font-medium">Location</label>
                <Input
                  value={selected.location}
                  onChange={(e) =>
                    setSelected({ ...selected, location: e.target.value })
                  }
                />
              </div>

              {/* Open Time */}
              <div>
                <label className="block mb-2 font-medium">Open Time</label>
                <Input
                  value={selected.openTime}
                  onChange={(e) =>
                    setSelected({ ...selected, openTime: e.target.value })
                  }
                  placeholder="e.g., 8am"
                />
              </div>

              {/* Closing Time */}
              <div>
                <label className="block mb-2 font-medium">Closing Time</label>
                <Input
                  value={selected.closingTime}
                  onChange={(e) =>
                    setSelected({ ...selected, closingTime: e.target.value })
                  }
                  placeholder="e.g., 4pm"
                />
              </div>

              <DialogFooter>
                <Button
                  className="bg-[#6A4AAD] text-white w-full"
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

      {/* DELETE MODAL */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete About Us?</AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-sm">This action cannot be undone.</p>

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

export default AdminAboutPage;
