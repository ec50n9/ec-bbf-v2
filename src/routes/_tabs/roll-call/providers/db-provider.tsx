import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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
import { type Clazz, getAllClasses } from "@/services/class";
import {
  getAllStudents,
  insertStudent,
  type InsertStudentParams,
} from "@/services/student";
import { getAllSubjects, type Subject } from "@/services/subject";
import type { Student } from "@/services/types";
import { useStudentStore } from "@/stores/student-store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";

type DbProviderState = {
  initData: () => Promise<void>;
  addStudent: (student: InsertStudentParams) => Promise<number>;
};

export const useDbProviderStore = create<DbProviderState>((set, get) => ({
  initData: async () => {
    const updateAllDataList = useStudentStore.getState().updateAllDataList;

    const students = await getAllStudents();
    console.log("students:", students);
    updateAllDataList(students);
  },
  addStudent: async (student: InsertStudentParams) => {
    const res = await insertStudent(student);
    await get().initData();
    return res.lastInsertId;
  },
}));

export const DbProvider = () => {
  const addStudent = useDbProviderStore((state) => state.addStudent);

  const handleAddStudent = async (student: InsertStudentParams) => {
    const res = await addStudent(student);
    console.log("insert student res", res);
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

      <Dialog>
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
  classId: z.string().min(1, "请选择所在班级"),
  subjectId: z.string().min(1, "请选择所在课程"),
});

const AddStudentForm = (props: {
  onSubmit: (data: InsertStudentParams) => void;
}) => {
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      stuNo: "",
      name: "",
      classId: "",
      subjectId: "",
    },
  });

  const [clazzList, setClazzList] = useState<Clazz[]>([]);
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  useEffect(() => {
    Promise.all([getAllClasses(), getAllSubjects()]).then(
      ([_clazzList, _subjectList]) => {
        setClazzList(_clazzList);
        setSubjectList(_subjectList);
      },
    );
  }, []);

  const handleOnSubmit = (data: z.infer<typeof studentFormSchema>) => {
    props.onSubmit({
      name: data.name,
      stuNo: data.stuNo,
      classId: Number(data.classId),
      subjectId: Number(data.subjectId),
    });
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
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>班级</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择班级" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent side="bottom" className="h-60">
                  {clazzList.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>选择班级</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>课程</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择科目" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent side="bottom" className="h-60">
                  {subjectList.map((subject) => (
                    <SelectItem key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>选择科目</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">保存</Button>
      </form>
    </Form>
  );
};
