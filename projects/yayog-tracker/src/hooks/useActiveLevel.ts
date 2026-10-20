import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LEVELS, type Level } from "../program/types";
import { store } from "../storage";

export const ACTIVE_KEY = "yayog:active";
const ACTIVE_QUERY = ["yayog", "active"] as const;

const isLevel = (v: unknown): v is Level => LEVELS.includes(v as Level);

// Which Level's program the app shows. Defaults to Basic.
export function useActiveLevel() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ACTIVE_QUERY,
    staleTime: Infinity,
    queryFn: async (): Promise<Level> => {
      const v = (await store.get(ACTIVE_KEY)) as { level?: unknown } | null;
      return isLevel(v?.level) ? v.level : "basic";
    },
  });
  const set = useMutation({
    mutationFn: async (level: Level) => {
      qc.setQueryData(ACTIVE_QUERY, level);
      await store.set(ACTIVE_KEY, { level });
    },
  });
  return { level: query.data, loaded: query.isSuccess, setLevel: set.mutateAsync };
}
