import type { OperationConfig } from "@/components/share/ec-data-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type InsertStudentParams,
  getAllStudents,
  insertStudent,
  deleteStudent,
} from "@/services/student";
import { StudentGroup, Student } from "@/services/types";
import { useGlobalStore } from "@/stores/global-store";
import { useStudentStore } from "@/stores/student-store";
import type { EcPlugin } from "@/types/plugin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuTrash } from "react-icons/lu";
import { z } from "zod";
import { create } from "zustand";

type DbProviderState = {
  initData: () => Promise<void>;
  addStudent: (student: InsertStudentParams) => Promise<number>;
  delStudent: (id: number) => Promise<void>;
};

const useDbProviderStore = create<DbProviderState>((set, get) => ({
  initData: async () => {
    const updateAllDataList = useStudentStore.getState().updateAllDataList;

    const students = await getAllStudents();
    updateAllDataList(students);
  },
  addStudent: async (student: InsertStudentParams) => {
    const res = await insertStudent(student);
    await get().initData();
    return res.lastInsertId;
  },
  delStudent: async (id: number) => {
    await deleteStudent(id);
    await get().initData();
  },
}));

const actions: OperationConfig<Student | StudentGroup>[] = [
  {
    key: "delete",
    label: "删除",
    icon: LuTrash,
    supportedTypes: [Student, StudentGroup],
    action: (data: Student | StudentGroup) => {
      console.log(`Deleting ${data.name}`);
      if (data instanceof Student) {
        useDbProviderStore.getState().delStudent(data.id);
      } else {
        console.log("删除分组");
      }
    },
  },
];

const ProviderView = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const addStudent = useDbProviderStore((state) => state.addStudent);

  const handleAddStudent = async (
    student: Pick<InsertStudentParams, "name" | "stuNo">,
  ) => {
    const clazzId = useGlobalStore.getState().clazz?.id;
    const subjectId = useGlobalStore.getState().subject?.id;

    if (!clazzId || !subjectId) {
      throw new Error("未选择课程或课程分组");
    }

    await addStudent({ ...student, clazzId, subjectId });

    setDialogOpen(false);
  };

  return (
    <>
      <Select defaultValue="all">
        <SelectTrigger className="w-28">
          <SelectValue placeholder="选择数据类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="student">仅学生</SelectItem>
          <SelectItem value="student-group">仅分组</SelectItem>
        </SelectContent>
      </Select>

      <Input className="w-40" placeholder="输入关键词搜索" />

      <Button size="sm" variant="default">
        搜索
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">
            添加
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加学生</DialogTitle>
            <DialogDescription>
              在这里对你的个人资料进行更改。完成后点击保存。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AddStudentForm onSubmit={handleAddStudent} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const studentFormSchema = z.object({
  stuNo: z.string().min(1, "学号不能为空").max(10, "学号不能超过 10 个字符"),
  name: z.string().min(1, "姓名不能为空").max(10, "姓名不能超过 10 个字符"),
});

const AddStudentForm = (props: {
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

const plugin: EcPlugin<Student | StudentGroup> = {
  dataProvider: {
    id: "provider-db",
    name: "数据库",
    component: ProviderView,
    onInit: useDbProviderStore.getState().initData,
  },
  actions,
};

export default plugin;
