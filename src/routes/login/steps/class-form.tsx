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
import ActionButton from "../components/action-button";
import { useForm } from "react-hook-form";
import type { StepFormProps } from "../share";
import { useLoginStore } from "../store";

/** 年级分组 */
const gradeGroups = [
  {
    name: "小学",
    children: [
      { name: "一年级", id: "PS-1" },
      { name: "二年级", id: "PS-2" },
      { name: "三年级", id: "PS-3" },
      { name: "四年级", id: "PS-4" },
      { name: "五年级", id: "PS-5" },
      { name: "六年级", id: "PS-6" },
    ],
  },
  {
    name: "初中",
    children: [
      { name: "七年级", id: "MS-7" },
      { name: "八年级", id: "MS-8" },
      { name: "九年级", id: "MS-9" },
    ],
  },
  {
    name: "高中",
    children: [
      { name: "高一", id: "HS-10" },
      { name: "高二", id: "HS-11" },
      { name: "高三", id: "HS-12" },
    ],
  },
];

const classFormSchema = z.object({
  name: z
    .string()
    .min(1, "班级名称不能为空")
    .max(10, "班级名称不能超过 10 个字符"),
  grade: z.string().min(1, "请选择所在年级"),
  clazz: z.string().max(10, "长度不能大于 10").optional(),
});

export default function ClassForm(props: StepFormProps) {
  const form = useForm<z.infer<typeof classFormSchema>>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      grade: "",
      clazz: "",
    },
  });

  async function onSubmit(values: z.infer<typeof classFormSchema>) {
    const createClass = useLoginStore.getState().createClass;
    await createClass({
      clazzName: values.name,
      grade: values.grade,
      clazz: values.clazz,
    });
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
                <FormLabel>班级名称</FormLabel>
                <FormControl>
                  <Input placeholder="输入班级名称" {...field} />
                </FormControl>
                <FormDescription>这是您的公开显示名称</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年级</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择年级" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="bottom" className="h-60">
                    {gradeGroups.map((group) => (
                      <SelectGroup key={group.name}>
                        <SelectLabel>{group.name}</SelectLabel>
                        {group.children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>选择班级所在的年级</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clazz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>班别</FormLabel>
                <FormControl>
                  <Input placeholder="输入班别" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  1 = 1 班、2 = 2 班，以此类推...
                </FormDescription>
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
