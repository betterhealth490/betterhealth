"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Slider } from "~/components/ui/slider";
import { createSurveyAction } from "./actions";
import { useToast } from "~/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const formSchema = z.object({
  waterIntake: z.number().int().min(1).max(5),
  foodIntake: z.number().int().min(1).max(5),
  foodHealthQuality: z.number().int().min(1).max(5),
  sleepTime: z.number().int().min(1).max(5),
  sleepLength: z.number().int().min(1).max(5),
  sleepQuality: z.number().int().min(1).max(5),
  stressLevel: z.number().int().min(1).max(5),
  selfImage: z.number().int().min(1).max(5),
});

export function DailySurveyButton({ userId }: { userId: number }) {
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waterIntake: 2,
      foodIntake: 2,
      foodHealthQuality: 2,
      sleepTime: 2,
      sleepLength: 2,
      sleepQuality: 2,
      stressLevel: 2,
      selfImage: 2,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createSurveyAction(userId, values);
    if (result.ok) {
      toast({
        title: "Survey completed!",
        description: format(new Date(), "LLLL do, yyyy"),
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Complete daily survey</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Daily Survey {format(new Date(), "MM/dd/yyyy")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="waterIntake"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How much water did you drink?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Little to none</span>
                    <span>Consistently</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foodIntake"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How much food did you eat?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Barely ate</span>
                    <span>Constant meals</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foodHealthQuality"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How healthy was your food?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Unhealthy</span>
                    <span>Healthy</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sleepTime"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>What time did you go to sleep?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Early</span>
                    <span>Late</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sleepLength"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How long did you sleep?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sleepQuality"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How was the quality of your sleep?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Restless</span>
                    <span>Rejuvenating</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stressLevel"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How stressed did you feel?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>None at all</span>
                    <span>Overwhelming</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selfImage"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How do you feel about yourself?</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value - 1]}
                      onValueChange={(val) => field.onChange(val[0]! + 1)}
                      max={4}
                      step={1}
                    />
                  </FormControl>
                  <div className="flex w-full justify-between text-sm">
                    <span>Very Negative</span>
                    <span>Very Positive</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
