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
import { resetPassword } from "@/services/auth/authentication";

// icons
import { EyeOff, Eye } from "lucide-react";

const ResetPassword = () => {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (res: any) => {
      if (res?.success) {
        toast.success(res?.message || "Password reset successfully");

        // Redirect user to login page
        router.push("/login");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
    onError: (error: any) => {
      console.error("Reset Password Error:", error);
      toast.error(error || "An error occurred");
    },
  });

  const handleSubmit = () => {
    if (!token || !password) {
      toast.info("Please enter OTP and new password.");
      return;
    }

    mutate({ token, password });
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
          Reset Password
        </h1>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#666] dark:text-gray-300 mb-1">
              OTP Code
            </label>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full text-center tracking-[6px] text-lg dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-sm text-[#666] dark:text-gray-300 mb-1">
              New Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
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
              "Reset Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
