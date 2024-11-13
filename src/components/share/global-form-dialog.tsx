import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicForm, FieldConfig, FormValues } from "./dynamic-form";
import { useState } from "react";
import { createRoot } from "react-dom/client";

interface FormDialogProps {
  title: string;
  fields: FieldConfig[];
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  defaultOpen?: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
  title,
  fields,
  onSubmit,
  onCancel,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-1">
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            submitButtonText="确定"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 定义配置类型
export interface FormDialogConfig {
  title?: string;
  fields: FieldConfig[];
}

// 创建一个全局函数来显示表单对话框
export function createFormDialog<T extends FormValues>(
  config: FormDialogConfig
): Promise<T> {
  return new Promise((resolve, reject) => {
    const containerElement = document.createElement("div");
    document.body.appendChild(containerElement);

    const handleSubmit = (values: T) => {
      cleanup();
      resolve(values);
    };

    const handleCancel = () => {
      cleanup();
      reject(new Error("User cancelled"));
    };

    const root = createRoot(containerElement);
    root.render(
      <FormDialog
        title={config.title || "请输入"}
        fields={config.fields}
        onSubmit={handleSubmit as (values: FormValues) => void}
        onCancel={handleCancel}
      />
    );

    const cleanup = () => {
      root.unmount();
      containerElement.remove();
    };
  });
}

// 创建一个更友好的函数名称
export async function promptForm<T extends FormValues>(
  fields: FieldConfig[],
  title?: string
): Promise<T> {
  return createFormDialog<T>({ fields, title });
}
