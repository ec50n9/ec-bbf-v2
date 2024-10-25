import { Button } from "@/components/ui/button";
import type { Student } from "@/services/types";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ChevronRightIcon } from "lucide-react";

interface StudentItemProps {
  data: Student;
}

export default function StudentItem({ data }: StudentItemProps) {
  const handleOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    new WebviewWindow(`details-student-${data.id}`, {
      url: `/details/student/${data.id}`,
      title: data.name,
      width: 400,
      height: 500,
      // center: true,
      resizable: true,
      alwaysOnTop: true,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2">
      <div className="flex items-center justify-between">
        <span>{data.name}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={handleOnClick}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
