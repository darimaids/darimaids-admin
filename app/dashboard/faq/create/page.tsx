"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaq } from "@/services/faq/faqs";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const CreateFaqPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createFaq({
        question,
        answer,
      }),
    onSuccess: () => {
      toast.success("FAQ created successfully!");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      router.push("/dashboard/faq");
    },
    onError: (err: any) => toast.error(err),
  });

  return (
    <div className="sm:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New FAQ</h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Question</label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does your cleaning service include?"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Answer</label>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Our service includes dusting, mopping, vacuuming..."
            rows={4}
          />
        </div>

        <Button
          className="w-full py-3"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Spinner /> : "Create FAQ"}
        </Button>
      </div>
    </div>
  );
};

export default CreateFaqPage;
