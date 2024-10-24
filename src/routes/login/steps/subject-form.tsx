import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ActionButton from "../components/action-button";
import { useForm } from "react-hook-form";
import type { StepFormProps } from "../share";
import { useLoginStore } from "../store";

const subjectFormSchema = z.object({
  name: z
    .string()
    .min(1, "科目名称不能为空")
    .max(20, "科目名称不能超过 20 个字符"),
});

export default function SubjectForm(props: StepFormProps) {
  const form = useForm<z.infer<typeof subjectFormSchema>>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof subjectFormSchema>) {
    const createSubject = useLoginStore.getState().createSubject;
    await createSubject({ subjectName: values.name });
    props.onSuccess?.();
  }

  return (
    <div className="my-9 mx-auto w-96">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>科目名称</FormLabel>
                <FormControl>
                  <Input placeholder="输入科目名称" {...field} />
                </FormControl>
                <FormDescription>这是您的公开显示名称</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <ActionButton className="self-end rounded-full">下一步</ActionButton>
        </form>
      </Form>
    </div>
  );
}
