import { DynamicForm, type FieldConfig } from "@/components/share/dynamic-form";

export default function RankingList() {
  const formFields: FieldConfig[] = [
    {
      key: "username",
      label: "用户名",
      type: "text",
      required: true,
      placeholder: "请输入用户名",
      description: "用户名长度在 3-20 个字符之间",
    },
    {
      key: "age",
      label: "年龄",
      type: "number",
      min: 0,
      max: 150,
      required: true,
    },
    {
      key: "role",
      label: "角色",
      type: "select",
      required: true,
      options: [
        { label: "管理员", value: "admin" },
        { label: "用户", value: "user" },
      ],
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
    },
    {
      key: "active",
      label: "是否启用",
      type: "switch",
      defaultValue: true,
    },
  ];
  return (
    <DynamicForm
      fields={formFields}
      onSubmit={(values) => console.log(values)} // values 现在有正确的类型推导
      onChange={(values) => console.log("Form changed:", values)}
      submitButtonText="保存"
    />
  );
}
