import { useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LuUpload } from "react-icons/lu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileSelect: (file: File) => void;
}


export function ImportDialog({ open, onOpenChange, onFileSelect }: ImportDialogProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
            onFileSelect(file);
            onOpenChange(false);
        }
    }, [onFileSelect, onOpenChange]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
            onOpenChange(false);
        }
    }, [onFileSelect, onOpenChange]);

    const validateFile = (file: File): boolean => {
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            toast.error("请上传 Excel 文件(.xlsx 或 .xls)");
            return false;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("文件大小不能超过5MB");
            return false;
        }

        return true;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>导入学生名单</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* 导入说明 */}
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>请按照以下格式准备Excel文件:</p>
                        <ul className="list-disc pl-6">
                            <li>文件格式: .xlsx 或 .xls</li>
                            <li>必须包含以下列:
                                <ul className="list-circle pl-4">
                                    <li>stuNo: 学号</li>
                                    <li>name: 姓名</li>
                                </ul>
                            </li>
                            <li>第一行必须是列标题</li>
                        </ul>
                    </div>

                    {/* 文件上传区域 */}
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6",
                            "hover:border-primary hover:bg-accent hover:bg-opacity-50",
                            "transition-colors duration-200",
                            "cursor-pointer text-center",
                            isDragging && "border-primary bg-accent bg-opacity-50"
                        )}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={handleFileDrop}
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <LuUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-4 text-sm text-muted-foreground">
                            <p className="font-semibold">点击上传文件或拖拽文件到此处</p>
                            <p className="mt-1">支持 .xlsx, .xls 格式</p>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}