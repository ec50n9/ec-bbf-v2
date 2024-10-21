import Header from "@/components/share/header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** 标题栏 */
export default function TitleBar(props: {
  handleSelectOperation: (val: string) => void;
}) {
  return (
    <Header title="点名">
      <div className="flex items-center space-x-4">
        <Select
          defaultValue="normal"
          onValueChange={props.handleSelectOperation}
        >
          <SelectTrigger className="w-36">
            <span className="text-muted-foreground">模式:</span>
            <SelectValue placeholder="选择操作模式" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>操作模式</SelectLabel>
              <SelectItem value="normal">选择数据</SelectItem>
              <SelectItem value="lock-mode">锁定操作</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </Header>
  );
}
