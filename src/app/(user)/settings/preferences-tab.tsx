"use client";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";
import { cn, isDefined } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "~/hooks/use-toast";
import { ageEnum, genderEnum, specialtyEnum } from "~/db/schema";
import { PgEnum } from "drizzle-orm/pg-core";
import { updatePreferencesAction } from "./actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loading } from "~/components/loading";
import { Card, CardContent } from "~/components/ui/card";

const preferencesFormSchema = z.object({
  agePreference: z.enum(ageEnum.enumValues).optional(),
  genderPreference: z.enum(genderEnum.enumValues).optional(),
  specialtyPreference: z.enum(specialtyEnum.enumValues).optional(),
});

type preferencesFormValues = z.infer<typeof preferencesFormSchema>;

export default function PreferencesTab({
  patientId,
  agePreference,
  genderPreference,
  specialtyPreference,
}: {
  patientId: number;
  agePreference: (typeof ageEnum.enumValues)[number] | null;
  genderPreference: (typeof genderEnum.enumValues)[number] | null;
  specialtyPreference: (typeof specialtyEnum.enumValues)[number] | null;
}) {
  const router = useRouter();
  const form = useForm<preferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      agePreference: agePreference || undefined,
      genderPreference: genderPreference || undefined,
      specialtyPreference: specialtyPreference || undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: preferencesFormValues) => {
    const result = await updatePreferencesAction(patientId, {
      agePreference: values.agePreference || null,
      genderPreference: values.genderPreference || null,
      specialtyPreference: values.specialtyPreference || null,
    });
    if (result.ok) {
      toast({
        title: "Preferences updated.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="agePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-fit gap-x-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select an age range" />
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
              name="genderPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-fit gap-x-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
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
              name="specialtyPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-fit gap-x-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialty" />
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
      </CardContent>
    </Card>
  );
}
