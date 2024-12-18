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
import { memberQuestionnaireAction } from "./actions";
import { isDefined } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { ageEnum, genderEnum, specialtyEnum } from "~/db/schema";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useToast } from "~/hooks/use-toast";
import { Loader } from "lucide-react";

const formSchema = z.object({
  agePreference: z.enum(ageEnum.enumValues).optional(),
  genderPreference: z.enum(genderEnum.enumValues).optional(),
  specialtyPreference: z.enum(specialtyEnum.enumValues).optional(),
});

export function MemberForm() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  if (!isLoaded || !isDefined(user)) {
    return <Loading />;
  }
  const userId = user.unsafeMetadata.databaseId as number;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await memberQuestionnaireAction(userId, {
      agePreference: values.agePreference ?? null,
      genderPreference: values.genderPreference ?? null,
      specialtyPreference: values.specialtyPreference ?? null,
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
      toast({
        variant: "destructive",
        title: "An error occurred during signup",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Help us find the right therapist for you</CardTitle>
            <CardDescription>Select any preferences you have</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="agePreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Age Preference</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      className="flex flex-col space-y-1"
                    >
                      {ageEnum.enumValues.map((age) => (
                        <FormItem
                          key={age}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={age} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {age}
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
              name="genderPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender Preference</FormLabel>
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
              name="specialtyPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Specialty Preference</FormLabel>
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
