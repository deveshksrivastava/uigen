"use client";

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { User, Bot, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center px-4 text-center">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(129, 140, 248, 0.2)",
          }}
        >
          <Bot className="h-7 w-7 text-indigo-400" />
        </div>
        <p className="text-white font-semibold text-lg mb-2">
          Start a conversation to generate React components
        </p>
        <p className="text-slate-400 text-sm max-w-sm">
          I can help you create buttons, forms, cards, and more
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id || message.content}
            className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(129, 140, 248, 0.2)",
                  }}
                >
                  <Bot className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
            )}

            <div
              className={cn(
                "flex flex-col gap-2 max-w-[85%]",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn("rounded-xl px-4 py-3", message.role === "user" ? "shadow-sm" : "")}
                style={
                  message.role === "user"
                    ? { background: "#2563eb", color: "white" }
                    : {
                        background: "rgba(15, 23, 42, 0.75)",
                        color: "#e2e8f0",
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                      }
                }
              >
                <div className="text-sm">
                  {message.parts ? (
                    <>
                      {message.parts.map((part, partIndex) => {
                        switch (part.type) {
                          case "text":
                            return message.role === "user" ? (
                              <span key={partIndex} className="whitespace-pre-wrap">
                                {part.text}
                              </span>
                            ) : (
                              <MarkdownRenderer
                                key={partIndex}
                                content={part.text}
                                className="prose-sm prose-invert"
                              />
                            );
                          case "reasoning":
                            return (
                              <div
                                key={partIndex}
                                className="mt-3 p-3 rounded-md"
                                style={{
                                  background: "rgba(2, 5, 16, 0.6)",
                                  border: "1px solid rgba(99, 102, 241, 0.15)",
                                }}
                              >
                                <span className="text-xs font-medium text-indigo-400 block mb-1">
                                  Reasoning
                                </span>
                                <span className="text-sm text-slate-300">{part.reasoning}</span>
                              </div>
                            );
                          case "tool-invocation":
                            const tool = part.toolInvocation;
                            return (
                              <div
                                key={partIndex}
                                className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs font-mono"
                                style={{
                                  background: "rgba(2, 5, 16, 0.7)",
                                  border: "1px solid rgba(99, 102, 241, 0.12)",
                                }}
                              >
                                {tool.state === "result" && tool.result ? (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-slate-300">{tool.toolName}</span>
                                  </>
                                ) : (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                                    <span className="text-slate-300">{tool.toolName}</span>
                                  </>
                                )}
                              </div>
                            );
                          case "source":
                            return (
                              <div key={partIndex} className="mt-2 text-xs text-slate-400">
                                Source: {JSON.stringify(part.source)}
                              </div>
                            );
                          case "step-start":
                            return partIndex > 0 ? (
                              <hr
                                key={partIndex}
                                className="my-3"
                                style={{ borderColor: "rgba(99, 102, 241, 0.2)" }}
                              />
                            ) : null;
                          default:
                            return null;
                        }
                      })}
                      {isLoading &&
                        message.role === "assistant" &&
                        messages.indexOf(message) === messages.length - 1 && (
                          <div className="flex items-center gap-2 mt-3 text-slate-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-sm">Generating...</span>
                          </div>
                        )}
                    </>
                  ) : message.content ? (
                    message.role === "user" ? (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    ) : (
                      <MarkdownRenderer
                        content={message.content}
                        className="prose-sm prose-invert"
                      />
                    )
                  ) : isLoading &&
                    message.role === "assistant" &&
                    messages.indexOf(message) === messages.length - 1 ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-lg bg-blue-600 shadow-sm flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
