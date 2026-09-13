import type { ReactNode } from "react";

interface CardProps {
  title: ReactNode;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="yg-card">
      <p className="yg-name">{title}</p>
      {children}
    </div>
  );
}
