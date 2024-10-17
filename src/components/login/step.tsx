import { cn } from "@/lib/utils";
import type { IconType } from "react-icons/lib";

export type Step = {
  name: string;
  icon: IconType;
};

export default function Step(props: {
  className?: string;
  steps: Step[];
  current?: number;
}) {
  const steps = props.steps;
  const current = props.current ?? 1;

  return (
    <div className={cn(props.className)}>
      <h2 className="sr-only">Steps</h2>

      <div>
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn("h-2 rounded-full bg-blue-500")}
            style={{
              width: `${Math.max(0.05, current / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <ol className="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
          {steps.map((step, index) => (
            <li
              key={step.name}
              className={cn(
                "flex items-center justify-center sm:gap-1.5",
                index === 0 && "justify-start",
                index === steps.length - 1 && "justify-end",
                index <= current && "text-blue-600",
              )}
            >
              <step.icon className="size-5 sm:size-5" />
              <span className="hidden sm:inline">{step.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
