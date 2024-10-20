import { cn } from "@/lib/utils";

export default function Header(props: {
  className?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn("pt-9 flex justify-between items-center", props.className)}
    >
      <div>
        <h1 className="text-4xl text-slate-700 font-medium leading-snug">
          {props.title}
        </h1>
        {props.description && (
          <p className="mt-1 text-slate-400">{props.description}</p>
        )}
      </div>
      {props.children && <div>{props.children}</div>}
    </header>
  );
}
