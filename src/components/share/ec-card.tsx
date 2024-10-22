import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";

interface EcCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function EcCard({ title, className, children }: EcCardProps) {
  const [itemsAnimateParent, enableItemsAnimations] = useAutoAnimate();
  useEffect(() => {
    enableItemsAnimations(true);
  }, []);

  return (
    <div className={cn("relative rounded-2xl border bg-card p-3", className)}>
      <div className="absolute -top-0 left-4 -translate-y-1/2 text-xs text-muted-foreground bg-card px-1">
        {title}
      </div>
      <div ref={itemsAnimateParent} className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}
