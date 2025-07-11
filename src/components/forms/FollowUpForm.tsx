
"use client";

import React, { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitFollowUp, type FollowUpFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, AlertCircle, Edit3 } from "lucide-react";

interface FollowUpFormProps {
  requestId: string;
}

const followUpClientSchema = z.object({
  followUpNotes: z.string().min(3, { message: "ملاحظات المتابعة يجب أن تكون 3 أحرف على الأقل." }),
});


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="animate-spin ml-2" /> : <PlusCircle className="ml-2" />}
      إضافة متابعة
    </Button>
  );
}

export default function FollowUpForm({ requestId }: FollowUpFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: FollowUpFormState = { message: "", errors: {} };
  const [state, formAction] = useActionState(submitFollowUp, initialState);

  const form = useForm<z.infer<typeof followUpClientSchema>>({
    resolver: zodResolver(followUpClientSchema), 
    defaultValues: {
      followUpNotes: "",
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.updatedRequest && !state.errors?._form && !state.errors?.followUpNotes) { 
        toast({
          title: "نجاح",
          description: state.message,
        });
        form.reset(); 
      } else { 
         toast({
          variant: "destructive",
          title: "خطأ",
          description: state.errors?._form?.join(", ") || state.errors?.followUpNotes?.join(", ") || state.message || "حدث خطأ ما.",
        });
      }
    }
  }, [state, toast, form]);

  return (
    <Card className="shadow-xl border-primary/30">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center text-xl font-bold text-primary font-headline">
            <Edit3 className="ml-2 h-6 w-6" />
            إضافة متابعة جديدة
        </CardTitle>
        <CardDescription>سجل أي إجراءات أو اتصالات أو تحديثات متعلقة بهذا الطلب.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={async (evt) => {
                evt.preventDefault(); 
                const isValid = await form.trigger();
                if (isValid && formRef.current) {
                  const formData = new FormData(formRef.current);
                  formAction(formData);
                }
            }}
            className="space-y-4"
          >
            <input type="hidden" name="requestId" value={requestId} />
            <FormField
              control={form.control}
              name="followUpNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="مثال: تم الاتصال بالعميل، تم تحديد موعد معاينة الثلاثاء القادم..."
                      rows={4}
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {state.errors?._form && (
              <div className="flex items-center p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
                <AlertCircle className="h-5 w-5 ml-2 shrink-0" />
                <p>{state.errors._form.join(", ")}</p>
              </div>
            )}
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
