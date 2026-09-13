import { PROJECTS } from "./projects";

export default function App() {
  return (
    <div className="hub-wrap">
      <h1 className="hub-h1">vibe-projects</h1>
      <p className="hub-sub">Small personal apps, built quickly with AI.</p>
      <div className="hub-list">
        {PROJECTS.length === 0 && <p className="hub-empty">No projects yet.</p>}
        {PROJECTS.map((p) => (
          <a key={p.name} className="hub-card" href={p.href}>
            <p className="hub-card-title">{p.title}</p>
            <p className="hub-card-desc">{p.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
