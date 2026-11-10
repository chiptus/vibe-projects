import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TestResult } from "../program/levelTests";
import { store } from "../storage";

export const TESTS_KEY = "yayog:tests";
export const TESTS_QUERY = ["yayog", "tests"] as const;

// The person's recorded Level test results, oldest first. Only real results
// are stored; pass/fail, Highest passed and the next test are derived from them.
export function useLevelTests() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: TESTS_QUERY,
    staleTime: Infinity,
    queryFn: async (): Promise<TestResult[]> => {
      const v = (await store.get(TESTS_KEY)) as { results?: TestResult[] } | null;
      return Array.isArray(v?.results) ? v.results : [];
    },
  });
  const results = query.data ?? [];
  const record = useMutation({
    mutationFn: async (result: TestResult): Promise<string | null> => {
      const next = [...(qc.getQueryData<TestResult[]>(TESTS_QUERY) ?? results), result];
      const err = await store.set(TESTS_KEY, { results: next });
      if (err) return err;
      qc.setQueryData(TESTS_QUERY, next);
      return null;
    },
  });
  return { results, loaded: query.isSuccess, record: record.mutateAsync };
}
