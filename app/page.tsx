"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

// components
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// store
import { useAdminStore } from "@/store/useAdminStore";

// api
import { login } from "@/services/auth/authentication";

// icons
import { EyeOff, Eye } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const { setAdminData } = useAdminStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (res: any) => {
      if (res?.success && res?.data?.token && res?.data?.user) {
        const { token, user } = res.data;

        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("fullName", user.fullName || "");
        sessionStorage.setItem("email", user.email || "");

        setAdminData(token, user);

        toast.success("Login Successful!");
        router.push("/dashboard/overview");
      } else {
        toast.error("Login failed. Please try again.");
      }
    },
    onError: (error: any) => {
      // console.error("Login Error:", error);
      toast.error(error);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      toast.info("Please fill in all fields.");
      return;
    }
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#6A4AAD] flex justify-center items-center px-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl py-10 sm:py-16 px-6 sm:px-12 w-full sm:w-[584px] shadow-lg">
        <div className="flex justify-center mb-4">
          <Image
            src="/d_login.svg"
            alt="Darimaids Logo"
            width={80}
            height={71}
          />
        </div>

        <h1 className="text-lg sm:text-xl font-semibold text-center dark:text-white mb-8">
          Log in to your portal
        </h1>

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
            />
          </div>

          <div>
            <label className="block text-sm text-[#666] dark:text-gray-300 mb-1">
              Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>
            </div>
          </div>

          <Button
            className="w-full py-6 mt-4 text-white font-semibold"
            disabled={isPending}
            onClick={handleLogin}
          >
            {isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <Spinner />
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
