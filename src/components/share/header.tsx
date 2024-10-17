import { cn } from "@/lib/utils";

export default function Header(props: { className?: string; title: string }) {
  return (
    <header className={cn("", props.className)}>
      <h1 className="pt-9 text-4xl font-medium leading-snug">{props.title}</h1>
    </header>
  );
}
