import { type FieldConfig } from "@/components/share/dynamic-form";
import { promptForm } from "@/components/share/global-form-dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";

export default function RankingList() {
  const formFields: FieldConfig[] = [
    {
      key: "username",
      label: "用户名",
      description: "用户名长度在 3-20 个字符之间",
      type: "text",
      zod: z
        .string()
        .trim()
        .min(3, { message: "用户名不能少于3个字符" })
        .max(20, { message: "用户名不能超出20个字符" })
        .optional(),
      placeholder: "请输入用户名",
    },
    {
      key: "age",
      label: "年龄",
      type: "number",
      min: 0,
      max: 150,
      zod: z.number().min(0).max(150),
    },
    {
      key: "role",
      label: "角色",
      type: "select",
      options: [
        { label: "管理员", value: "admin" },
        { label: "用户", value: "user" },
      ],
      zod: z.string().trim().min(1, { message: "请选择" }),
    },
    {
      key: "permissions",
      label: "权限",
      type: "multiSelect",
      options: [
        { label: "读取", value: "read" },
        { label: "写入", value: "write" },
        { label: "删除", value: "delete" },
      ],
      zod: z.array(z.string()).min(1, { message: "请至少选择一个" }),
    },
    {
      key: "active",
      label: "是否启用",
      type: "switch",
      defaultValue: true,
      zod: z.boolean(),
    },
  ];

  const handleClick = async () => {
    const userInfo = await promptForm(formFields, "请填写用户信息");
    console.log("用户信息: ", userInfo);
  };

  return (
    <div className="flex h-full items-center justify-center text-gray-500">
      开发中...
    </div>
  );
}
