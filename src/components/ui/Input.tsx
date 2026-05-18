import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? "border-red-400 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? "border-red-400 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
