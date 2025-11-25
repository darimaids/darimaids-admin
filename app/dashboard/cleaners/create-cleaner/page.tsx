"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

import { createCleaner } from "@/services/auth/authentication";

import { EyeOff, Eye } from "lucide-react";

const CreateWorkerPage = () => {
  const router = useRouter();

  const [workerData, setWorkerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    province: "",
    zipCode: "",
    gender: "",
    dateOfBirth: "",
    workExperience: {
      yearOfExperience: "",
      preferredService: "",
      preferredWorkArea: "",
      availability: "",
      shortBio: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const workerMutation = useMutation({
    mutationFn: () =>
      createCleaner({
        ...workerData,
        workExperience: {
          ...workerData.workExperience,
          yearOfExperience: Number(workerData.workExperience.yearOfExperience),
        },
      }),
    onSuccess: (res: any) => {
      if (res?.success) {
        toast.success("Worker created successfully!");
        router.push("/dashboard/cleaners"); // redirect to worker list
      } else {
        toast.error("Failed to create worker.");
      }
    },
    onError: (err: any) => {
      toast.error(err || "Something went wrong.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkExpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWorkerData((prev) => ({
      ...prev,
      workExperience: { ...prev.workExperience, [name]: value },
    }));
  };

  return (
    <div className="sm:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Worker</h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            value={workerData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={workerData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </div>

        <InputField
          label="Email Address"
          name="email"
          value={workerData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />

        <InputField
          label="Phone Number"
          name="phoneNumber"
          value={workerData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={workerData.password}
          onChange={handleChange}
          placeholder="Enter password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <InputField
          label="Address"
          name="address"
          value={workerData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />

        <InputField
          label="Province"
          name="province"
          value={workerData.province}
          onChange={handleChange}
          placeholder="Enter province"
        />

        <InputField
          label="ZIP Code"
          name="zipCode"
          value={workerData.zipCode}
          onChange={handleChange}
          placeholder="Enter ZIP code"
        />

        <div>
          <label className="block mb-2 font-medium text-sm">Gender</label>
          <Select
            value={workerData.gender}
            onValueChange={(value) =>
              setWorkerData((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={workerData.dateOfBirth}
          onChange={handleChange}
        />

        {/* Work Experience */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Work Experience</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Years of Experience"
            name="yearOfExperience"
            value={workerData.workExperience.yearOfExperience}
            onChange={handleWorkExpChange}
            placeholder="e.g. 5"
          />
          <InputField
            label="Preferred Service"
            name="preferredService"
            value={workerData.workExperience.preferredService}
            onChange={handleWorkExpChange}
            placeholder="Cleaning"
          />
          <InputField
            label="Preferred Work Area"
            name="preferredWorkArea"
            value={workerData.workExperience.preferredWorkArea}
            onChange={handleWorkExpChange}
            placeholder="Lakewood"
          />
          <InputField
            label="Availability"
            name="availability"
            value={workerData.workExperience.availability}
            onChange={handleWorkExpChange}
            placeholder="Full-time"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm">Short Bio</label>
          <Textarea
            name="shortBio"
            value={workerData.workExperience.shortBio}
            onChange={handleWorkExpChange}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <Button
          className="w-full py-3 mt-4"
          disabled={workerMutation.isPending}
          onClick={() => workerMutation.mutate()}
        >
          {workerMutation.isPending ? <Spinner /> : "Create Worker"}
        </Button>
      </div>
    </div>
  );
};

// Input helper component
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
}: any) => (
  <div className="relative">
    <label className="block mb-1 font-medium text-sm">{label}</label>
    <Input
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pr-10"
    />
    {type === "password" && (
      <button
        type="button"
        className="absolute right-3 top-[45px] transform -translate-y-1/2"
        onClick={() => setShowPassword((prev: boolean) => !prev)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )}
  </div>
);

export default CreateWorkerPage;
