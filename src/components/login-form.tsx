"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { login_user } from "@/server/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // form
  const { handleSubmit, register } = useForm();
  const login_user_handler: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const payload = {
      email: data.email,
      password: data.password,
    };
    try {
      const response = await login_user(payload);
      if (response?.success) {
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error(response?.message || "Unable to login");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-slate-200/80 bg-white/95 p-0 shadow-2xl shadow-slate-300/30 backdrop-blur">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(login_user_handler)}
            className="p-5 sm:p-7 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col text-left">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Sign in to your account dashboard and continue managing your content.
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-slate-700">Email address</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="name@yourdomain.com"
                  className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Enter your secure password"
                  className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden overflow-hidden bg-slate-900 md:block">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <Image
              src="/profile.jpg"
              width={700}
              height={700}
              alt="Workspace visual"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-0 z-20 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Secure Admin Area</p>
              <p className="mt-2 text-sm text-slate-100">Your projects, blogs, and skill updates in one reliable place.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
