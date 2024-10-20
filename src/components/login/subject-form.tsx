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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ActionButton from "@/components/login/action-button";
import { useForm } from "react-hook-form";
import type { StepFormProps } from "./share";

const subjectFormSchema = z.object({
  name: z
    .string()
    .min(1, "科目名称不能为空")
    .max(20, "科目名称不能超过 20 个字符"),
  class_id: z.string().min(1, "请选择班级"),
});

export default function SubjectForm(props: StepFormProps) {
  const form = useForm<z.infer<typeof subjectFormSchema>>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      class_id: "",
    },
  });

  function onSubmit(values: z.infer<typeof subjectFormSchema>) {
    console.log("on submit", values);
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
          <FormField
            control={form.control}
            name="class_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>班级</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择班级" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="bottom" className="h-60">
                    <SelectGroup>
                      <SelectLabel>班级</SelectLabel>
                      <SelectItem value="class-1">1 班</SelectItem>
                      <SelectItem value="class-2">2 班</SelectItem>
                      <SelectItem value="class-3">3 班</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>选择科目所在的班级</FormDescription>
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
