import { useState } from "react";

interface TokenFieldProps {
  token: string | null;
  onChange: () => void;
  onTurnOff: () => void;
}

/** The token, read-only and masked, with the actions that touch it. Editing happens in the dialog. */
export function TokenField({ token, onChange, onTurnOff }: TokenFieldProps) {
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setReveal(true); // clipboard unavailable: show the token so it can be copied by hand
    }
  };

  return (
    <>
      <input
        readOnly
        aria-label="Sync token"
        type={reveal ? "text" : "password"}
        value={token ?? ""}
        placeholder="No token set"
        className="mb-1.5 w-full rounded-lg border border-ln bg-bg p-2.5 font-mono text-sm text-mu"
      />
      <div className="flex flex-wrap items-center gap-3 text-xs text-mu">
        <button type="button" className="underline" onClick={onChange}>
          {token ? "Change token…" : "Set up sync…"}
        </button>
        {token && (
          <>
            <button type="button" className="underline" onClick={() => setReveal((v) => !v)}>
              {reveal ? "Hide" : "Show"}
            </button>
            <button type="button" className="underline" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="underline" onClick={onTurnOff}>
              Turn off
            </button>
          </>
        )}
      </div>
    </>
  );
}
