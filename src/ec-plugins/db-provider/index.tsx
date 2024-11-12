import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LuImport } from "react-icons/lu";
import { AddStudentForm } from "@/components/students/AddStudentForm";
import { ImportDialog } from "@/components/students/ImportDialog";
import { useDbProviderStore } from "./store";
import { actions } from "./actions";
import { useGlobalStore } from "@/stores/global-store";
import type { EcPlugin } from "@/types/plugin";
import { Student, StudentGroup } from "@/services/types";
import { InsertStudentParams } from "@/services/student";
import { toast } from "sonner";
import { read, utils } from "xlsx";


const ProviderView = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);

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

    const handleFileImport = async (file: File) => {
        if (!file) return;

        const clazzId = useGlobalStore.getState().clazz?.id;
        const subjectId = useGlobalStore.getState().subject?.id;

        if (!clazzId || !subjectId) {
            toast.error("请先选择课程和课程分组");
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = read(data, { type: "array" });

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = utils.sheet_to_json<{ stuNo: string; name: string }>(
                    worksheet,
                );

                const isValidData = jsonData.every(
                    (row: any) =>
                        row.stuNo &&
                        row.name &&
                        typeof row.stuNo === "string" &&
                        typeof row.name === "string",
                );

                if (!isValidData) {
                    toast.error("Excel文件格式不正确，请确保包含stuNo和name列");
                    return;
                }

                for (const row of jsonData) {
                    await addStudent({
                        stuNo: String(row.stuNo),
                        name: String(row.name),
                        clazzId,
                        subjectId,
                    });
                }

                toast.success("导入成功！");
                setImportDialogOpen(false);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("导入失败:", error);
            toast.error("导入失败，请检查文件格式");
        }
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

            <Button
                size="sm"
                variant="default"
                onClick={() => setImportDialogOpen(true)}
            >
                <LuImport className="mr-2 h-4 w-4" />
                导入
            </Button>

            <ImportDialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
                onFileSelect={handleFileImport}
            />
        </>
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