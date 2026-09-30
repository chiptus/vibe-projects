import type { ReactNode } from "react";

interface CardProps {
  title: ReactNode;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="mb-2.5 rounded-lg bg-sf px-3 pt-3 pb-2.5">
      <div className="mb-2 text-lg leading-tight font-semibold">{title}</div>
      {children}
    </div>
  );
}
