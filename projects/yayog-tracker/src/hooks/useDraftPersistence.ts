import { useEffect, useRef } from "react";
import type { Entry, Position } from "../program/types";
import { store } from "../storage";
import { DRAFT_KEY } from "./useWorkoutLog";

interface Draft {
  w: number;
  d: number;
  entries: Entry[];
  notes: string;
  at?: number;
}

interface DraftPersistenceInput {
  ready: boolean;
  pos: Position | null;
  entries: Entry[];
  notes: string;
}

// Persists the in-progress form so it survives the phone locking / app
// backgrounding. Primary trigger: the page being hidden. Fallback: 5 s of
// inactivity. Never during a save, and only if something changed.
export function useDraftPersistence({ ready, pos, entries, notes }: DraftPersistenceInput) {
  const lastDraft = useRef("");
  const savingRef = useRef(false);
  const draftRef = useRef<Draft | null>(null);
  draftRef.current = ready && pos ? { w: pos.w, d: pos.d, entries, notes } : null;

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

  return {
    /** Call once a save lands, so the next form change writes a fresh draft. */
    markSaved: () => {
      lastDraft.current = "";
    },
    setSaving: (v: boolean) => {
      savingRef.current = v;
    },
  };
}
