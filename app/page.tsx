"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAdminStore } from "@/store/useAdminStore";
import { login } from "@/services/auth/authentication";

const LoginPage = () => {
  const router = useRouter();
  const { setAdminData } = useAdminStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (res: any) => {
      if (res?.success && res?.data?.token && res?.data?.user) {
        const { token, user } = res.data;

        // ✅ store in session storage
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("fullName", user.fullName || "");
        sessionStorage.setItem("email", user.email || "");

        // ✅ update Zustand store
        setAdminData(token, user);

        toast.success("Login Successful!");
        router.push("/dashboard/overview");
      } else {
        toast.error("Login failed. Please try again.");
      }
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      toast.error("Invalid credentials");
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
          Log in to your account
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
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-[#6A4AAD] font-semibold cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
