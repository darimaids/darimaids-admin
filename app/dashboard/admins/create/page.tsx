"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmin } from "@/services/admins/admins";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// shadcn select
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CreateAdmin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createAdmin({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        address,
        gender,
        dateOfBirth,
        role,
      }),
    onSuccess: () => {
      toast.success("Admin created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      router.push("/dashboard/admins");
    },
    onError: (err: any) => toast.error(err || "Something went wrong"),
  });

  return (
    <div className="sm:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Admin</h1>

      <div className="space-y-6">
        {/* first name */}
        <div>
          <label className="block mb-2 font-medium">First Name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="James"
          />
        </div>

        {/* last name */}
        <div>
          <label className="block mb-2 font-medium">Last Name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Amao"
          />
        </div>

        {/* email */}
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="james@yopmail.com"
          />
        </div>

        {/* phone */}
        <div>
          <label className="block mb-2 font-medium">Phone Number</label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="09012345678"
          />
        </div>

        {/* password */}
        <div>
          <label className="block mb-2 font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Strong password"
          />
        </div>

        {/* address */}
        <div>
          <label className="block mb-2 font-medium">Address</label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="23, Adekunle street, Yaba, Lagos"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Role</label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* date of birth */}
        <div>
          <label className="block mb-2 font-medium">Date of Birth</label>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        {/* ROLE - shadcn select */}
        <div>
          <label className="block mb-2 font-medium">Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-[#6A4AAD] text-white w-full flex gap-2"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Spinner /> : "Create Admin"}
        </Button>
      </div>
    </div>
  );
};

export default CreateAdmin;
