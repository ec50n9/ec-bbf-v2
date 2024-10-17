import { cn } from "@/lib/utils";

export default function Header(props: {
  className?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className={cn("pt-9", props.className)}>
      <h1 className="text-4xl text-slate-700 font-medium leading-snug">{props.title}</h1>
      {props.description && (
        <p className="mt-1 text-slate-400">{props.description}</p>
      )}
    </header>
  );
}
