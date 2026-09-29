import { PROJECTS } from "../projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectList() {
  return (
    <div className="flex flex-col gap-2.5">
      {PROJECTS.length === 0 && <p className="text-base text-mu">No projects yet.</p>}
      {PROJECTS.map((p) => (
        <ProjectCard key={p.name} project={p} />
      ))}
    </div>
  );
}
