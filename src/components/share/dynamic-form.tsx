import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

// 基础类型定义
interface Option {
  label: string;
  value: string | number;
}

// 字段类型定义
type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiSelect"
  | "switch"
  | "radio"
  | "checkbox"
  | "textarea"
  | "password"
  | "date";

// 字段值类型
type FieldValue<T extends FieldType> = T extends "number"
  ? number
  : T extends "switch" | "checkbox"
  ? boolean
  : T extends "multiSelect"
  ? string[]
  : string;

// 基础字段配置
interface BaseFieldConfig {
  key: string;
  label: string;
  zod: z.ZodTypeAny;
  disabled?: boolean;
  description?: string;
}

// 文本类字段配置
interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "password" | "textarea";
  placeholder?: string;
  defaultValue?: string;
}

// 数字字段配置
interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  placeholder?: string;
  defaultValue?: number;
}

// 选择类字段配置
interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "radio";
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
}

// 多选字段配置
interface MultiSelectFieldConfig extends BaseFieldConfig {
  type: "multiSelect";
  options: Option[];
  defaultValue?: string[];
}

// 布尔类字段配置
interface BooleanFieldConfig extends BaseFieldConfig {
  type: "switch" | "checkbox";
  defaultValue?: boolean;
}

// 日期字段配置
interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  defaultValue?: string;
}

// 统一字段配置类型
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | MultiSelectFieldConfig
  | BooleanFieldConfig
  | DateFieldConfig;

// 表单值类型
export type FormValues = {
  [K in FieldConfig["key"]]: FieldValue<FieldConfig["type"]>;
};

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (values: FormValues) => void;
  onChange?: (values: FormValues) => void;
  submitButtonText?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onChange,
  submitButtonText = "提交",
}) => {
  // 动态构建 Zod schema
  const generateSchema = (
    fields: FieldConfig[]
  ): z.ZodObject<Record<string, z.ZodTypeAny>> => {
    const schema: Record<string, z.ZodTypeAny> = {};

    for (const field of fields) {
      // let fieldSchema: z.ZodTypeAny;

      // switch (field.type) {
      //   case "text":
      //   case "textarea":
      //   case "password":
      //   case "date":
      //   case "select":
      //   case "radio":
      //     fieldSchema = z.string().trim();
      //     if (field.required) {
      //       fieldSchema = fieldSchema.min(1, {
      //         message: `${field.label}不能为空`,
      //       });
      //     }
      //     break;
      //   case "number":
      //     fieldSchema = z.number();
      //     if (typeof field.min === "number")
      //       fieldSchema = fieldSchema.min(field.min, {
      //         message: `${field.label}不能小于${field.min}`,
      //       });
      //     if (typeof field.max === "number")
      //       fieldSchema = fieldSchema.max(field.max, {
      //         message: `${field.label}不能大于${field.max}`,
      //       });
      //     break;
      //   case "multiSelect":
      //     fieldSchema = z.array(z.string());
      //     if (field.required) {
      //       fieldSchema = fieldSchema.min(1, {
      //         message: `请至少选择一个${field.label}`,
      //       });
      //     }
      //     break;
      //   case "switch":
      //   case "checkbox":
      //     fieldSchema = z.boolean();
      //     break;
      // }

      schema[field.key] = field.zod;
    }

    return z.object(schema);
  };

  const defaultValues = fields.reduce<Partial<FormValues>>(
    (acc, field) =>
      Object.assign({}, acc, {
        [field.key]:
          field.defaultValue ??
          (field.type === "switch" || field.type === "checkbox"
            ? false
            : field.type === "multiSelect"
            ? []
            : field.type === "number"
            ? 0
            : ""),
      }),
    {}
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(generateSchema(fields)),
    defaultValues: defaultValues as FormValues,
    mode: "onBlur",
  });

  // 监听表单变化
  useEffect(() => {
    if (onChange) {
      const subscription = form.watch((value) => {
        onChange(value as FormValues);
      });
      return () => subscription.unsubscribe();
    }
  }, [form.watch, onChange]);

  const renderField = (fieldConfig: FieldConfig) => {
    return (
      <FormField
        key={fieldConfig.key}
        control={form.control}
        name={fieldConfig.key}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldConfig.label}</FormLabel>
            <FormControl>
              {(() => {
                switch (fieldConfig.type) {
                  case "text":
                  case "password":
                    return (
                      <Input
                        {...field}
                        type={fieldConfig.type}
                        placeholder={fieldConfig.placeholder}
                        disabled={fieldConfig.disabled}
                      />
                    );
                  case "number":
                    return (
                      <Input
                        {...field}
                        type="number"
                        min={fieldConfig.min}
                        max={fieldConfig.max}
                        placeholder={fieldConfig.placeholder}
                        disabled={fieldConfig.disabled}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    );
                  case "textarea":
                    return (
                      <Textarea
                        {...field}
                        placeholder={fieldConfig.placeholder}
                        disabled={fieldConfig.disabled}
                      />
                    );
                  case "select":
                    return (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={fieldConfig.disabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={fieldConfig.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldConfig.options.map((option) => (
                            <SelectItem
                              key={option.value.toString()}
                              value={option.value.toString()}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  case "multiSelect":
                    return (
                      <div className="space-y-2">
                        {fieldConfig.options.map((option) => (
                          <div
                            key={option.value.toString()}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={field.value?.includes(
                                option.value.toString()
                              )}
                              onCheckedChange={(checked) => {
                                const currentValues =
                                  (field.value as string[]) || [];
                                const newValue = checked
                                  ? [...currentValues, option.value.toString()]
                                  : currentValues.filter(
                                      (v) => v !== option.value.toString()
                                    );
                                field.onChange(newValue);
                              }}
                              disabled={fieldConfig.disabled}
                            />
                            <Label>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    );
                  case "radio":
                    return (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={fieldConfig.disabled}
                        className="flex flex-col space-y-1"
                      >
                        {fieldConfig.options.map((option) => (
                          <div
                            key={option.value.toString()}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option.value.toString()}
                              id={option.value.toString()}
                            />
                            <Label htmlFor={option.value.toString()}>
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    );
                  case "switch":
                    return (
                      <Switch
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                        disabled={fieldConfig.disabled}
                      />
                    );
                  case "date":
                    return (
                      <Input
                        {...field}
                        type="date"
                        disabled={fieldConfig.disabled}
                      />
                    );
                }
              })()}
            </FormControl>
            {fieldConfig.description && (
              <FormDescription>{fieldConfig.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map(renderField)}
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  );
};
