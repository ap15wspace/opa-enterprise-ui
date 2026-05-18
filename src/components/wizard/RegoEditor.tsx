"use client";

import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/Input";

// Dynamically import CodeMirror (client-side only)
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded" />,
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function RegoEditor({ value, onChange, readOnly = false }: Props) {
  return (
    <div className="rounded-md border border-gray-300 overflow-hidden">
      <CodeMirror
        value={value}
        height="320px"
        onChange={onChange}
        editable={!readOnly}
        basicSetup={{ lineNumbers: true, foldGutter: true }}
        className="text-sm font-mono"
        theme="light"
      />
    </div>
  );
}

/** Fallback textarea for when CodeMirror is not available */
export function RegoTextarea({ value, onChange }: Omit<Props, "readOnly">) {
  return (
    <Textarea
      label="Rego Policy"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={16}
      className="font-mono text-sm"
    />
  );
}
