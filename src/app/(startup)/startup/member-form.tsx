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
  agePreference: z.enum(ageEnum.enumValues).nullable(),
  genderPreference: z.enum(genderEnum.enumValues).nullable(),
  specialtyPreference: z.enum(specialtyEnum.enumValues).nullable(),
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
  const userId = parseInt(user.unsafeMetadata.databaseId as string);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await memberQuestionnaireAction(userId, values);
    if (result.ok) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          questionnaireCompleted: true,
        },
      });
      router.push("/dashboard");
    } else {
      console.log(result.error);
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
