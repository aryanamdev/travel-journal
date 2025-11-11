"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ROUTES } from '../constants/routes'
import Link from 'next/link'

type LoginUserInput = {
    email: string
    password: string
}

const LoginPage = () => {
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const { register, handleSubmit } = useForm<LoginUserInput>()

    const onUserCreate = async (values: LoginUserInput) => {
        setLoading(true)
        try {
            const response = await axios.post(ROUTES.USER.LOGIN, values)
            const data = await response.data

            if (!data?.success) {
                throw new Error(data?.message)
            }

            toast.success("User authenticated Successfully")
            router.push(`/userProfile`)

        } catch (error: any) {  
            toast.error(error.message)
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (values: LoginUserInput) => {
        onUserCreate(values)
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle>Log in</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">

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
                                                {loading ? "Please wait..." : "Login"}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Do not have an account?{" "}
                                        <Link href="/register" className="underline underline-offset-4">
                                            Sign up
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

export default LoginPage