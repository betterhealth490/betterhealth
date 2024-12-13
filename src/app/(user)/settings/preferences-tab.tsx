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


const preferencesFormSchema = z.object({
    age: z
      .string(),
    gender: z
      .string(),
    specialty: z
      .string(),
})
  
type preferencesFormValues = z.infer<typeof preferencesFormSchema>

// This can come from your database or API.
const defaultValues: Partial<preferencesFormValues> = {
//   specialty: "specialty",
//   preferences: [
//     { value: "https://shadcn.com" },
//     { value: "http://twitter.com/shadcn" },
//   ],
}

export default function PreferencesTab(){
    const form = useForm<preferencesFormValues>({
        resolver: zodResolver(preferencesFormSchema),
        defaultValues,
        mode: "onChange",
    })
    
    function onSubmit(data: preferencesFormValues) {
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
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-fit gap-x-2">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an age range"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="18-24">18-24</SelectItem>
                                    <SelectItem value="25-34">25-34</SelectItem>
                                    <SelectItem value="35-44">35-44</SelectItem>
                                    <SelectItem value="45-54">45-54</SelectItem>
                                    <SelectItem value="65+">65+</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can change your age preference here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-fit gap-x-2">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a gender"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can change your gender preference here.
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
                                        <SelectValue placeholder="Select a specialty"/>
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
                                You can change your specialty preference here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Update Preferences</Button>
                </form>
            </Form>
        </div>
    )
}