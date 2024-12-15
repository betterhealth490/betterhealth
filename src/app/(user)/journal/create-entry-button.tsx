"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, PencilLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { createJournalAction } from "./actions";
import { useToast } from "~/hooks/use-toast";

const formSchema = z.object({
  title: z.string(),
  text: z.string(),
});

interface CreateEntryButtonProps {
  userId: number;
}

export function CreateEntryButton({ userId }: CreateEntryButtonProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createJournalAction(userId, values.title, values.text);
      toast({
        title: "Successfully created a journal",
      });
      setOpen(false);
      form.reset();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };
  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PencilLine />
            Write an entry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[925px]">
          <DialogHeader>
            <DialogTitle>Write an entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your thoughts here"
                        className="sm:h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader className="animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
