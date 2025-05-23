/* eslint-disable @next/next/no-img-element */
"use client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginDTO } from "@/lib/client/zod-schemas/loginSchema"
import { useLoginUser } from "@/lib/client/mutations/authMutations"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/atoms/input-password"
import { toast } from "sonner"
import { GalleryVerticalEnd } from "lucide-react"

const Page = () => {
    const router = useRouter()
    const { mutate: loginUser } = useLoginUser({
        onSuccess: () => {
            toast.success("Login Successful")
            router.push("/home")
        },
        onError: (error) => {
            const errorMessage = error.message || "Login failed. Please try again."
            toast.error(errorMessage)
        },
    })

    const form = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = (data: LoginDTO) => {
        loginUser(data)
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        QuickSort Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Login to your account</h1>
                                    <p className="text-balance text-sm text-muted-foreground">
                                        Enter your username below to login
                                    </p>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row gap-2 items-center justify-start">
                                                    <span>Username</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Username" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex flex-row gap-2 items-center justify-start">
                                                    <span>Password</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <PasswordInput placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uc3RydWN0aW9ufGVufDB8fDB8fHww"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}

export default Page
