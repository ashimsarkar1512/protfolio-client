"use client"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {register_user} from "@/server/auth";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import { useState } from "react";

export function RegisterFrom({className,...props}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const {handleSubmit,register} = useForm()
    const register_new_user:SubmitHandler<FieldValues> =async (data)=>{
        setIsLoading(true)
        const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
        }
        try {
            const result = await register_user(payload)
            if(result?.success){
                toast.success(result?.message || "Account created successfully")
                router.push("/")
            }else {
                toast.error(result?.message || "Unable to create account")
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-slate-200/80 bg-white/95 p-0 shadow-2xl shadow-slate-300/30 backdrop-blur">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit(register_new_user)} className="p-5 sm:p-7 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col text-left">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Set up a secure admin profile to manage portfolio content professionally.
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                                <Input
                                    {...register("name")}
                                    id="name"
                                    type="text"
                                    placeholder="Ashim Kumar Sarkar"
                                    className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                                    required
                                />
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
                                    placeholder="Create a strong password"
                                    className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                                    required/>
                            </div>
                            <Button type="submit" disabled={isLoading} className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800">
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>

                            <div className="text-center text-sm text-slate-600">
                                 Have an account?{" "}
                                <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Log in
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
                            alt="Account setup visual"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 z-20 p-6 text-white">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">New Account</p>
                            <p className="mt-2 text-sm text-slate-100">Create your admin identity and start organizing content with clarity.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}