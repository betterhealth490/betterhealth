"use client";
import { genderEnum, specialtyEnum } from "~/db/schema";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "~/hooks/use-toast";
import { updateIdentityAction } from "./actions";

const identityFormSchema = z.object({
  age: z.string().optional(),
  gender: z.enum(genderEnum.enumValues).optional(),
  specialty: z.enum(specialtyEnum.enumValues).optional(),
});

type identityFormValues = z.infer<typeof identityFormSchema>;

export function IdentityTab({
  userId,
  age,
  gender,
  specialty,
}: {
  userId: number;
  age: number | undefined;
  gender: (typeof genderEnum.enumValues)[number] | undefined;
  specialty: (typeof specialtyEnum.enumValues)[number] | undefined;
}) {
  const form = useForm<identityFormValues>({
    resolver: zodResolver(identityFormSchema),
    defaultValues: {
      age: age?.toString(),
      gender,
      specialty,
    },
    mode: "onChange",
  });

  async function onSubmit(data: identityFormValues) {
    const result = await updateIdentityAction(userId, {
      age: data.age ? parseInt(data.age) : undefined,
      gender: data.gender,
      specialty: data.specialty,
    });
    if (result.ok) {
      toast({
        title: "Identity updated",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  }

  return (
    <div className="space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl className="w-fit gap-x-2">
                  <Input
                    min={18}
                    type="number"
                    placeholder="Enter your age"
                    {...field}
                  />
                </FormControl>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-fit gap-x-2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-fit gap-x-2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Identity</Button>
        </form>
      </Form>
    </div>
  );
}
