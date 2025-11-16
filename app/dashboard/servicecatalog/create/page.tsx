"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService } from "@/services/catalog/serviceCatalog";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const CreateServicePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState<string[]>([""]);
  const [prices, setPrices] = useState<string[]>([""]);

  const mutation = useMutation({
    mutationFn: () =>
      createService({
        serviceName,
        description,
        serviceType,
        prices,
      }),
    onSuccess: () => {
      toast.success("Service created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      router.push("/dashboard/servicecatalog");
    },
    onError: (err: any) => toast.error(err),
  });

  return (
    <div className="sm:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Service</h1>

      <div className="space-y-6">
        {/* NAME */}
        <div>
          <label className="block mb-2 font-medium">Service Name</label>
          <Input
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Airbnb Cleaning"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ideal for recurring upkeep..."
            rows={4}
          />
        </div>

        {/* SERVICE TYPE */}
        <div>
          <label className="block mb-2 font-medium">Service Type</label>
          {serviceType.map((item, idx) => (
            <Input
              key={idx}
              className="mb-2"
              value={item}
              onChange={(e) => {
                const arr = [...serviceType];
                arr[idx] = e.target.value;
                setServiceType(arr);
              }}
              placeholder="Dusting all surfaces"
            />
          ))}

          <Button
            variant="outline"
            onClick={() => setServiceType([...serviceType, ""])}
          >
            <Plus className="mr-1" />
            Add item
          </Button>
        </div>

        {/* PRICES */}
        <div>
          <label className="block mb-2 font-medium">Prices</label>
          {prices.map((item, idx) => (
            <Input
              key={idx}
              className="mb-2"
              value={item}
              onChange={(e) => {
                const arr = [...prices];
                arr[idx] = e.target.value;
                setPrices(arr);
              }}
              placeholder="Studio / 1 Bed - 1 Bath = $130"
            />
          ))}

          <Button variant="outline" onClick={() => setPrices([...prices, ""])}>
            <Plus className="mr-1" />
            Add price
          </Button>
        </div>

        <Button
          className="bg-[#6A4AAD] text-white w-full flex gap-2"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Spinner /> : "Create Service"}
        </Button>
      </div>
    </div>
  );
};

export default CreateServicePage;
