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
import { createMessageAction } from "./actions";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxUser } from "./message";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const formSchema = z.object({
  recipientId: z.coerce.number(),
  text: z.string(),
});

interface CreateMessageButtonProps {
  userId: number;
  therapists: InboxUser[];
}

export function CreateMessageButton({
  userId,
  therapists,
}: CreateMessageButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessageAction(userId, values.recipientId, values.text);
    setOpen(false);
    router.refresh();
  };
  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PencilLine />
            Send a message
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[925px]">
          <DialogHeader>
            <DialogTitle>Send a message</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4">
              <FormField
                name="recipientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a therapist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {therapists.map((therapist) => (
                          <SelectItem value={therapist.id.toString()}>
                            {therapist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message"
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
                <Button type="submit">Submit</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
