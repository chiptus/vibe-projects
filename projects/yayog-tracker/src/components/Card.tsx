import type { ReactNode } from "react";

interface CardProps {
  title: ReactNode;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="yg-card">
      <div className="yg-name">{title}</div>
      {children}
    </div>
  );
}
