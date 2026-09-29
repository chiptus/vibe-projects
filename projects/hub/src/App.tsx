import { Header } from "./components/Header";
import { ProjectList } from "./components/ProjectList";

export default function App() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-12 pb-16">
      <Header />
      <ProjectList />
    </div>
  );
}
