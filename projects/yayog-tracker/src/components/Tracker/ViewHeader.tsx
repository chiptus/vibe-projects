import type { ReactNode } from "react";

interface ViewHeaderProps {
  title: string;
  subtitle: string;
  menu: ReactNode;
}

// Header for views that are not a single workout (History, Level test).
export function ViewHeader({ title, subtitle, menu }: ViewHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <h1 className="text-3xl leading-none font-extrabold tracking-tight">
        {title}
        <small className="mt-1.5 block text-sm font-medium tracking-wide text-mu">{subtitle}</small>
      </h1>
      {menu}
    </div>
  );
}
