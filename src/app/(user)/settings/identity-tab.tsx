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


const identityFormSchema = z.object({
    gender: z
      .string(),
    specialty: z
      .string(),
})
  
type identityFormValues = z.infer<typeof identityFormSchema>

// This can come from your database or API.
const defaultValues: Partial<identityFormValues> = {
//   specialty: "specialty",
//   identity: [
//     { value: "https://shadcn.com" },
//     { value: "http://twitter.com/shadcn" },
//   ],
}

export default function IdentityTab(){
    const form = useForm<identityFormValues>({
        resolver: zodResolver(identityFormSchema),
        defaultValues,
        mode: "onChange",
    })
    
    function onSubmit(data: identityFormValues) {
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
                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-fit gap-x-2">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your gender"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can change your gender here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specialty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-fit gap-x-2">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your specialty"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="lgbtq">LGBTQ</SelectItem>
                                    <SelectItem value="addiction">Addiction</SelectItem>
                                    <SelectItem value="health">Health</SelectItem>
                                    <SelectItem value="behavioral">Behavioral</SelectItem>
                                    <SelectItem value="counseling">Counseling</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can change your specialty here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Update Identity</Button>
                </form>
            </Form>
        </div>
    )
}