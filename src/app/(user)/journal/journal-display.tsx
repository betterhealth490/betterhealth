"use client";

import { Separator } from "~/components/ui/separator";
import format from "date-fns/format";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { type JournalEntry } from "./journal-entry";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { updateJournalAction } from "./actions";
import { useToast } from "~/hooks/use-toast";
import { Loader } from "lucide-react";

interface JournalDisplayProps {
  userId: number;
  entry: JournalEntry | null;
  setEntry: (entry: JournalEntry) => void;
}

export function JournalDisplay(props: JournalDisplayProps) {
  const [display, setDisplay] = useState<"view" | "edit">("view");
  return display === "view" ? (
    <ViewDisplay {...props} onEdit={() => setDisplay("edit")} />
  ) : (
    <EditDisplay {...props} onClick={() => setDisplay("view")} />
  );
}

function ViewDisplay({
  entry,
  onEdit,
}: JournalDisplayProps & { onEdit: () => void }) {
  return entry ? (
    <Card className="flex h-full flex-col">
      <CardContent className="grow p-0">
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <div className="grid gap-1">
                  <div>
                    <span className="font-semibold">{entry.title}</span>
                  </div>
                </div>
              </div>
              {entry.date && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(entry.date), "PPpp")}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              {entry.text}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  ) : (
    <Card className="flex h-full flex-col">
      <CardContent className="grow p-0">
        <div className="flex h-full flex-col">
          <div className="p-8 text-center text-muted-foreground">
            No entry selected
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  title: z.string(),
  text: z.string(),
});

function EditDisplay({
  entry,
  setEntry,
  onClick,
}: JournalDisplayProps & { onClick: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: entry?.title,
      text: entry?.text,
    },
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateJournalAction(entry!.id, values.title, values.text);
      toast({
        title: "Successfully edited journal",
      });
      setEntry({ ...entry!, ...values });
      onClick();
      form.reset();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };
  return entry ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Card className="flex h-full flex-col">
          <CardContent className="grow p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <FormField
                    name="title"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 space-y-0">
                        <FormControl>
                          <Input className="font-semibold" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {entry.date && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(entry.date), "PPpp")}
                  </div>
                )}
              </div>
              <Separator />
              <FormField
                name="text"
                render={({ field }) => (
                  <FormItem className="grid h-full gap-1 p-4">
                    <FormControl>
                      <Textarea
                        className="whitespace-pre-wraptext-sm flex-1"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Button variant="outline">Cancel</Button>
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader className="animate-spin" />
              )}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  ) : (
    <Card className="flex h-full flex-col">
      <CardContent className="grow p-0">
        <div className="flex h-full flex-col">
          <div className="p-8 text-center text-muted-foreground">
            No entry selected
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
