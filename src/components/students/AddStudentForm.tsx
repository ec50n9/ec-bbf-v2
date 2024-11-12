import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import type { InsertStudentParams } from "@/services/student";

const studentFormSchema = z.object({
    stuNo: z.string().min(1, "学号不能为空").max(10, "学号不能超过 10 个字符"),
    name: z.string().min(1, "姓名不能为空").max(10, "姓名不能超过 10 个字符"),
});

export const AddStudentForm = (props: {
    onSubmit: (data: Pick<InsertStudentParams, "name" | "stuNo">) => void;
}) => {
    const form = useForm<z.infer<typeof studentFormSchema>>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            stuNo: "",
            name: "",
        },
    });

    const handleOnSubmit = (data: z.infer<typeof studentFormSchema>) => {
        props.onSubmit({
            name: data.name,
            stuNo: data.stuNo,
        });

        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
                className="flex flex-col gap-y-8"
            >
                <FormField
                    control={form.control}
                    name="stuNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>学号</FormLabel>
                            <FormControl>
                                <Input placeholder="输入学号" {...field} />
                            </FormControl>
                            <FormDescription>输入学生的学号</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>姓名</FormLabel>
                            <FormControl>
                                <Input placeholder="输入姓名" {...field} />
                            </FormControl>
                            <FormDescription>输入学生的姓名</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">保存</Button>
            </form>
        </Form>
    );
};
