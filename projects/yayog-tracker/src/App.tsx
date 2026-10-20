import { useState } from "react";
import { Loading } from "./components/Tracker/Loading";
import type { View } from "./components/Tracker/MainMenu";
import { Tracker } from "./components/Tracker/Tracker";
import { useActiveLevel } from "./hooks/useActiveLevel";
import { useLevelTests } from "./hooks/useLevelTests";

export default function App() {
  const active = useActiveLevel();
  const tests = useLevelTests();
  // Lives here, above the per-Level Tracker, so changing Level keeps the current view.
  const [view, setView] = useState<View>("today");
  if (!active.loaded || !active.level || !tests.loaded) return <Loading />;
  // Keyed by level so switching Programs starts from fresh tracker state.
  return <Tracker key={active.level} level={active.level} view={view} onView={setView} tests={tests} onLevel={active.setLevel} />;
}
