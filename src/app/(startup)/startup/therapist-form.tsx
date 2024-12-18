"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Loading } from "~/components/loading";
import { therapistQuestionnaireAction } from "./actions";
import { isDefined } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { genderEnum, specialtyEnum } from "~/db/schema";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useToast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { Loader } from "lucide-react";

const formSchema = z.object({
  age: z.coerce.number().min(18).optional(),
  gender: z.enum(genderEnum.enumValues).optional(),
  specialty: z.enum(specialtyEnum.enumValues).optional(),
});

export function TherapistForm() {
  const { isLoaded, user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  if (!isLoaded || !isDefined(user)) {
    return <Loading />;
  }
  const userId = parseInt(user.unsafeMetadata.databaseId as string);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await therapistQuestionnaireAction(userId, {
      age: values.age ?? null,
      gender: values.gender ?? null,
      specialty: values.specialty,
    });
    if (result.ok) {
      const res = await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          questionnaireCompleted: true,
        },
      });
      if (res.unsafeMetadata.questionnaireCompleted) {
        router.refresh();
      }
    } else {
      console.log(result.error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Let patients know more about you</CardTitle>
            <CardDescription>
              Choose what information patients can see
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your age" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      className="flex flex-col space-y-1"
                    >
                      {genderEnum.enumValues.map((gender) => (
                        <FormItem
                          key={gender}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={gender} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {gender}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      className="flex flex-col space-y-1"
                    >
                      {specialtyEnum.enumValues.map((specialty) => (
                        <FormItem
                          key={specialty}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={specialty} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {specialty === "lgbtq" ? "LGBTQ+" : specialty}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex w-full justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader className="animate-spin" />
              )}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
