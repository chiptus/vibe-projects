import { useEffect, useRef } from "react";
import type { Entry, Level, Position } from "../program/types";
import { store } from "../storage";
import { DRAFT_KEY } from "./useWorkoutLog";

interface Draft {
  level: Level;
  w: number;
  d: number;
  entries: Entry[];
  notes: string;
  at?: number;
}

interface DraftPersistenceInput {
  level: Level;
  ready: boolean;
  pos: Position | null;
  entries: Entry[];
  notes: string;
}

// Persists the in-progress form so it survives the phone locking / app
// backgrounding. Primary trigger: the page being hidden. Fallback: 5 s of
// inactivity. Never during a save, and only if something changed from the
// baseline: the form as loaded (or as left after a save). An untouched form is
// never written, so it can't overwrite a newer draft that synced in from another device.
export function useDraftPersistence({ level, ready, pos, entries, notes }: DraftPersistenceInput) {
  const lastDraft = useRef("");
  const savingRef = useRef(false);
  const draftRef = useRef<Draft | null>(null);
  draftRef.current = ready && pos ? { level, w: pos.w, d: pos.d, entries, notes } : null;

  const writeDraft = () => {
    if (!draftRef.current || savingRef.current) return;
    const payload = JSON.stringify(draftRef.current);
    if (payload === lastDraft.current) return;
    lastDraft.current = payload;
    store.set(DRAFT_KEY, { ...draftRef.current, at: Date.now() });
  };

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") writeDraft();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !pos) return;
    const t = setTimeout(() => writeDraft(), 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pos, entries, notes]);

  const baseline = (d: { w: number; d: number; entries: Entry[]; notes: string } | null) => {
    // Same shape and key order as the payload writeDraft builds, or an untouched form would look changed.
    lastDraft.current = d ? JSON.stringify({ level, w: d.w, d: d.d, entries: d.entries, notes: d.notes }) : "";
  };

  return {
    /** Record the form as just loaded, so only a change from it is written. */
    markBaseline: baseline,
    /** Call once a save lands; pass the form now on screen so only a change from it writes a draft. */
    markSaved: baseline,
    setSaving: (v: boolean) => {
      savingRef.current = v;
    },
  };
}
