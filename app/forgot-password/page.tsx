"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// api
import { forgotPassword } from "@/services/auth/authentication";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res: any) => {
      if (res?.success) {
        toast.success(res?.message || "Reset password link sent to your email");

        // Navigate to reset password page
        router.push("/reset-password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
    onError: (error: any) => {
      console.error("Forgot Password Error:", error);
      toast.error(error || "An error occurred");
    },
  });

  const handleSubmit = () => {
    if (!email) {
      toast.info("Please enter your email.");
      return;
    }

    mutate({ email });
  };

  return (
    <div className="min-h-screen bg-[#6A4AAD] flex justify-center items-center px-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl py-10 sm:py-16 px-6 sm:px-12 w-full sm:w-[584px] shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/d_login.svg"
            alt="Darimaids Logo"
            width={80}
            height={71}
          />
        </div>

        {/* Header */}
        <h1 className="text-lg sm:text-xl font-semibold text-center dark:text-white mb-8">
          Forgot Password
        </h1>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#666] dark:text-gray-300 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            className="w-full py-6 mt-4 text-white font-semibold"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <Spinner />
              </span>
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </div>

        {/* Footer */}
        {/* <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-[#6A4AAD] font-semibold cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p> */}
      </div>
    </div>
  );
};

export default ForgotPassword;
