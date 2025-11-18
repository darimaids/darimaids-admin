"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import { MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { getFaqs, editFaq, deleteFaq } from "@/services/faq/faqs";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface FaqResponse {
  success: boolean;
  data: FaqItem[];
}

const AdminFAQPage = () => {
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<FaqItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<FaqResponse>({
    queryKey: ["faqs"],
    queryFn: getFaqs,
  });

  const faqs = data?.data ?? [];

  const editMutation = useMutation({
    mutationFn: async (updated: FaqItem) => await editFaq(updated._id, updated),
    onSuccess: () => {
      toast.success("FAQ updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setEditOpen(false);
    },
    onError: (err: any) => toast.error(err),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => {
      toast.success("FAQ deleted");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err),
  });

  return (
    <div className="sm:p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manage FAQs</h1>

        <Link href="/dashboard/faq/create">
          <Button className="bg-[#6A4AAD] text-white hover:bg-[#58399b]">
            <Plus className="w-4 h-4 mr-2" />
            Create New FAQ
          </Button>
        </Link>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1E1E] border rounded-xl p-4 flex justify-between"
            >
              <div className="w-full">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-6 ml-4" />
            </div>
          ))}

        {!isLoading &&
          faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-white dark:bg-[#1E1E1E] border rounded-xl p-4 flex justify-between items-start hover:shadow transition"
            >
              <div className="pr-4">
                <h2 className="font-semibold text-lg">{faq.question}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {faq.answer}
                </p>
              </div>

              {/* POPUP MENU */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      aria-label={`open menu for ${faq.question}`}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                    >
                      <MoreVertical />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent align="end" className="w-40 p-1">
                    <button
                      className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      onClick={() => {
                        setSelected(faq);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#333] rounded text-red-500"
                      onClick={() => setDeleteId(faq._id)}
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

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">Question</label>
                <Input
                  value={selected.question}
                  onChange={(e) =>
                    setSelected({ ...selected, question: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Answer</label>
                <Textarea
                  rows={3}
                  value={selected.answer}
                  onChange={(e) =>
                    setSelected({ ...selected, answer: e.target.value })
                  }
                />
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

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
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

export default AdminFAQPage;
