import { Loading } from "./components/Tracker/Loading";
import { Tracker } from "./components/Tracker/Tracker";
import { useActiveLevel } from "./hooks/useActiveLevel";
import { useLevelTests } from "./hooks/useLevelTests";

export default function App() {
  const active = useActiveLevel();
  const tests = useLevelTests();
  if (!active.loaded || !active.level || !tests.loaded) return <Loading />;
  // Keyed by level so switching Programs starts from fresh tracker state.
  return <Tracker key={active.level} level={active.level} tests={tests} onLevel={active.setLevel} />;
}
