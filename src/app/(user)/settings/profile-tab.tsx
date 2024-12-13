'use client'

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import Link from "next/link"
import { useFieldArray, useForm } from "react-hook-form"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "~/hooks/use-toast"


const profileFormSchema = z.object({
    firstName: z
      .string()
      .max(100, "First name can't be more than 100 characters."),
    lastName: z
      .string()
      .max(100, "Last name can't be more than 100 characters."),
    email: z
      .string()
      .max(255, "Email cant be more than 255 characters.")
      .email(),
    password: z.string()
    .min(8, "Password must be atleast 8 characters.")
    .max(255, "Password cant be more than 255 characters."),
})
  
type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileTab({ firstName, lastName, email, password } : { firstName: string | undefined, lastName: string | undefined, email: string | undefined, password: string | undefined }){
    const defaultValues: Partial<ProfileFormValues> = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })
    
    function onSubmit(data: ProfileFormValues) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
    }

    return(
        <div className="space-y-6 p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex w-full gap-12">
                        <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="first name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    You can change your first name here.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl className="w-full">
                                    <Input placeholder="last name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    You can change your last name here.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
                            </FormControl>
                            <FormDescription>
                                You can change your email address here.
                            </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="password" {...field}/>
                        </FormControl>
                        <FormDescription>
                            You can change your password here.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Update Profile</Button>
                </form>
            </Form>
        </div>
    )
}