import Header from "@/components/share/header";
import {
  Select,
  SelectContent,
  SelectItem,
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
            <SelectItem value="normal">数据优先</SelectItem>
            <SelectItem value="lock-mode">操作优先</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Header>
  );
}
