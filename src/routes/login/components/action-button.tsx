import { cn } from "@/lib/utils";

export default function ActionButton(props: {
  className?: string;
  children: React.ReactNode;
  type?: "submit";
}) {
  return (
    <button
      className={cn(
        "shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear",
        props.className,
      )}
      type={props.type}
    >
      {props.children}
    </button>
  );
}
