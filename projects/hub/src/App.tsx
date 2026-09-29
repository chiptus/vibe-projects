import { PROJECTS } from "./projects";

export default function App() {
  return (
    <div className="mx-auto max-w-[640px] px-5 pt-12 pb-16">
      <h1 className="mb-1.5 text-[34px] font-extrabold tracking-[-0.01em]">vibe-projects</h1>
      <p className="mb-8 text-[15px] text-mu">Small personal apps, built quickly with AI.</p>
      <div className="flex flex-col gap-2.5">
        {PROJECTS.length === 0 && <p className="text-[15px] text-mu">No projects yet.</p>}
        {PROJECTS.map((p) => (
          <a
            key={p.name}
            className="block rounded-[10px] border border-ln bg-sf px-[18px] py-4 text-inherit no-underline transition-[border-color] duration-150 ease-[ease] hover:border-ac focus-visible:border-ac"
            href={p.href}
          >
            <p className="mb-1 text-[18px] font-bold">{p.title}</p>
            <p className="text-[14px] text-mu">{p.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
