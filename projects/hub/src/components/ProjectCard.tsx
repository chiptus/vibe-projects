import type { ProjectLink } from "../projects";

export function ProjectCard({ project }: { project: ProjectLink }) {
  return (
    <a
      className="block rounded-[10px] border border-ln bg-sf px-[18px] py-4 text-inherit no-underline transition-[border-color] duration-150 ease-[ease] hover:border-ac focus-visible:border-ac"
      href={project.href}
    >
      <p className="mb-1 text-[18px] font-bold">{project.title}</p>
      <p className="text-[14px] text-mu">{project.description}</p>
    </a>
  );
}
