"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "~/components/ui/checkbox";
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
import { createInitialSurveyAction } from "./actions";
import { isDefined } from "~/lib/utils";
import { UserMetadata } from "~/middleware";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  answers: z.array(z.array(z.string())),
});

export default function StartupPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [page, setPage] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { answers: [[], [], [], [], [], [], []] },
  });
  if (!isLoaded || !isDefined(user)) {
    return <Loading />;
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(JSON.stringify(values, null, 2));
    if (page === 6) {
      const result = await createInitialSurveyAction(
        parseInt((user.unsafeMetadata as UserMetadata).databaseId),
        values,
      );
      if (isDefined(result)) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            initialSurveyCompleted: true,
          },
        });
        router.push("/dashboard");
      } else {
        console.log("error");
      }
    } else {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-16">
      <h1 className="text-4xl font-medium">
        Fill out this initial survey to get matched with a{" "}
        <span className="text-primary">therapist!</span>
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {surveyQuestions.map(
            (question, index) =>
              page === index && (
                <Card className="flex h-[400px] w-[500px] flex-col">
                  <CardHeader>
                    <CardTitle>{question.question}</CardTitle>
                    <CardDescription>Select all that apply</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      name="answers"
                      render={({ field }) => (
                        <div className="flex flex-col gap-4">
                          <FormItem className="space-y-3">
                            <div className="flex flex-col gap-4">
                              {question.answers.map((answer) => (
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={(field.value as string[][])[
                                        page
                                      ]?.includes(answer)}
                                      onCheckedChange={(checked) => {
                                        const copy = field.value as string[][];
                                        const questionArray = checked
                                          ? [
                                              ...copy[page]!.filter(
                                                (val) => val !== answer,
                                              ),
                                              answer,
                                            ]
                                          : copy[page]!.filter(
                                              (val) => val !== answer,
                                            );
                                        copy.splice(page, 1, questionArray);
                                        return field.onChange(copy);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {answer}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        </div>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-1 items-end justify-between">
                    <div>
                      {page > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setPage(page - 1)}
                        >
                          Back
                        </Button>
                      )}
                    </div>
                    <div>
                      <Button type="submit">
                        {page < 6 ? "Next" : "Submit"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ),
          )}
        </form>
      </Form>
    </div>
  );
}

export const surveyQuestions = [
  {
    question: "What brings you to the platform today?",
    answers: [
      "Stress or anxiety",
      "Depression or sadness",
      "Relationship issues",
      "Trauma or abuse",
      "Personal growth or self-esteem",
      "Other",
    ],
  },
  {
    question: "What type of support are you looking for?",
    answers: [
      "Individual therapy",
      "Couples therapy",
      "Family therapy",
      "Group therapy",
      "Not sure yet",
    ],
  },
  {
    question: "What challenges have you faced in previous therapy experiences?",
    answers: [
      "Difficulty connecting with the therapist",
      "Lack of progress",
      "Scheduling conflicts",
      "Cost concerns",
      "Privacy concerns",
      "Other",
    ],
  },
  {
    question: "How would you prefer to communicate with your therapist?",
    answers: ["Video sessions", "Phone calls", "Messaging/chat"],
  },
  {
    question: "Are there specific qualities you'd like in a therapist?",
    answers: [
      "Similar gender",
      "Close in age",
      "Cultural or religious background",
      "Specialized expertise (e.g., LGBTQ+, trauma, etc.)",
    ],
  },
  {
    question:
      "What resources or tools do you find helpful for mental health support?",
    answers: [
      "Meditation or mindfulness techniques",
      "Journaling exercises",
      "Self-help books or articles",
      "Mobile apps or online resources",
      "Support groups",
      "Other",
    ],
  },
  {
    question: "What are your primary goals for therapy?",
    answers: [
      "Coping with daily stressors",
      "Improving relationships",
      "Managing specific mental health conditions",
      "Personal growth and self-awareness",
      "Other",
    ],
  },
] as const;
