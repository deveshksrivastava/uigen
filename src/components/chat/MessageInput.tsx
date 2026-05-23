"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-4"
      style={{ borderTop: "1px solid rgba(129, 140, 248, 0.1)" }}
    >
      <div className="relative max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the React component you want to create..."
          disabled={isLoading}
          className="w-full min-h-[80px] max-h-[200px] pl-4 pr-14 py-3.5 rounded-xl resize-none focus:outline-none transition-all text-[15px] font-normal text-slate-100 placeholder:text-slate-500"
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !input?.trim()}
          className="absolute right-3 bottom-3 p-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          style={{ background: "transparent" }}
        >
          <Send
            className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLoading || !input?.trim() ? "text-slate-600" : "text-indigo-400"}`}
          />
        </button>
      </div>
    </form>
  );
}
