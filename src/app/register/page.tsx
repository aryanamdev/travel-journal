"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ROUTES } from "../constants/routes"

interface RegisterUserInput {
    fullName: string
    email: string
    password: string
}

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)

    const {register, handleSubmit} = useForm<RegisterUserInput>()
    const router = useRouter()


    const onUserCreate = async (values: RegisterUserInput) => {
        setLoading(true)
        try {
            const response = await axios.post(ROUTES.USER.REGISTER, values)
            const data = await response.data

            if(!data?.success){
                throw new Error(data?.message || "Error creating user")
            }

            toast.success(data?.message)
            router.push("/login")

        } catch (error: any) {
            toast.error(error.message)
            console.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    const onSubmit = (values: RegisterUserInput) => {
        onUserCreate(values)
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            {...register("fullName")}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            {...register("email")}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" type="password" {...register("password")} required />
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-3">
                                            <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? "Please wait..." :"Sign Up"}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Already have an account?{" "}
                                        <Link href="/login" className="underline underline-offset-4">
                                            Log in
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}
