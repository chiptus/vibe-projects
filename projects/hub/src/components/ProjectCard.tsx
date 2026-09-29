import type { ProjectLink } from "../projects";

export function ProjectCard({ project }: { project: ProjectLink }) {
  return (
    <a
      className="block rounded-lg border border-ln bg-sf px-4 py-4 text-inherit no-underline transition-[border-color] duration-150 ease-in-out hover:border-ac focus-visible:border-ac"
      href={project.href}
    >
      <p className="mb-1 text-lg font-bold">{project.title}</p>
      <p className="text-sm text-mu">{project.description}</p>
    </a>
  );
}
