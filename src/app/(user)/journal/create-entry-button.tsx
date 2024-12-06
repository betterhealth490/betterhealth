"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Pencil, PencilLine, Send } from "lucide-react";
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
import { createMessageAction } from "./actions";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { JournalUser } from "./journal-entry";

const formSchema = z.object({
  title: z.string(),
  text: z.string(),
  therapists: z.array(z.coerce.number()),
});

interface CreateEntryButtonProps {
  userId: number;
  therapists: JournalUser[];
}

export function CreateEntryButton({
  userId,
  therapists,
}: CreateEntryButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    router.refresh();
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
              {form.formState.isSubmitting ? (
                <Button disabled>
                  <Loader className="animate-spin" /> Submit
                </Button>
              ) : (
                <Button type="submit">
                  <Pencil />
                  Write
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
