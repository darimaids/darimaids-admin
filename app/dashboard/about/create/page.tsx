"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAbout } from "@/services/about/about";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const CreateAboutPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createAbout({
        title,
        description,
      }),
    onSuccess: () => {
      toast.success("About section created successfully!");
      queryClient.invalidateQueries({ queryKey: ["about"] });
      router.push("/dashboard/about");
    },
    onError: (err: any) => toast.error(err),
  });

  return (
    <div className="sm:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create About Section</h1>

      <div className="space-y-6">
        {/* TITLE */}
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Learn more about us"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="We are the best janitor in town..."
            rows={5}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          className="w-full py-3"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Spinner /> : "Create About"}
        </Button>
      </div>
    </div>
  );
};

export default CreateAboutPage;
