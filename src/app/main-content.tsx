"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: unknown[];
    data: unknown;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Deterministic star positions via LCG so they're stable across renders
const STARS = Array.from({ length: 70 }, (_, i) => {
  const a = 1664525,
    c = 1013904223,
    m = 2 ** 32;
  let seed = i * 16807 + 42;
  const next = () => {
    seed = (a * seed + c) % m;
    return seed / m;
  };
  return {
    id: i,
    x: +(next() * 100).toFixed(2),
    y: +(next() * 100).toFixed(2),
    size: +(next() * 1.5 + 0.4).toFixed(2),
    opacity: +(next() * 0.55 + 0.25).toFixed(2),
    delay: +(next() * 6).toFixed(2),
    duration: +(next() * 3 + 2).toFixed(2),
  };
});

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        {/* Deep Space background */}
        <div
          className="h-screen w-screen overflow-hidden relative"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #0f0722 0%, #020510 55%, #000308 100%)",
          }}
        >
          {/* Stars */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {STARS.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Nebula blobs */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-10%",
              left: "-5%",
              width: "45%",
              height: "55%",
              background: "radial-gradient(ellipse, #4c1d9540, transparent 70%)",
              filter: "blur(40px)",
              animation: "nebula-drift 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-15%",
              right: "-8%",
              width: "50%",
              height: "60%",
              background: "radial-gradient(ellipse, #0c4a6e35, transparent 70%)",
              filter: "blur(50px)",
              animation: "nebula-drift 24s ease-in-out 4s infinite reverse",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "40%",
              right: "20%",
              width: "25%",
              height: "30%",
              background: "radial-gradient(ellipse, #1e1b4b30, transparent 70%)",
              filter: "blur(35px)",
              animation: "nebula-drift 20s ease-in-out 8s infinite",
            }}
          />

          {/* Aurora streak */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "28%",
              left: "0",
              right: "0",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 5%, #818cf840 25%, #38bdf830 55%, #a78bfa25 75%, transparent 95%)",
              filter: "blur(4px)",
              animation: "aurora-flow 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "29%",
              left: "0",
              right: "0",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 10%, #c4b5fd20 30%, #60a5fa20 60%, transparent 90%)",
              filter: "blur(2px)",
              animation: "aurora-flow 12s ease-in-out 1.5s infinite",
            }}
          />

          {/* Main layout on top of space background */}
          <ResizablePanelGroup direction="horizontal" className="h-full relative z-10">
            {/* Left Panel - Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div
                className="h-full flex flex-col"
                style={{
                  background: "rgba(3, 7, 18, 0.78)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRight: "1px solid rgba(129, 140, 248, 0.08)",
                }}
              >
                {/* Chat Header */}
                <div
                  className="h-14 flex items-center px-6"
                  style={{ borderBottom: "1px solid rgba(129, 140, 248, 0.1)" }}
                >
                  <h1 className="text-lg font-semibold tracking-tight text-white">
                    React Component Generator
                  </h1>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle
              className="w-[1px] transition-colors"
              style={{ background: "rgba(129, 140, 248, 0.1)" }}
            />

            {/* Right Panel - Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div
                className="h-full flex flex-col"
                style={{
                  background: "rgba(3, 7, 18, 0.65)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                {/* Top Bar */}
                <div
                  className="h-14 px-6 flex items-center justify-between"
                  style={{
                    borderBottom: "1px solid rgba(129, 140, 248, 0.1)",
                    background: "rgba(3, 7, 18, 0.85)",
                  }}
                >
                  <Tabs
                    value={activeView}
                    onValueChange={(v) => setActiveView(v as "preview" | "code")}
                  >
                    <TabsList
                      className="p-0.5 h-9"
                      style={{
                        background: "rgba(15, 23, 42, 0.7)",
                        border: "1px solid rgba(129, 140, 248, 0.15)",
                      }}
                    >
                      <TabsTrigger
                        value="preview"
                        className="px-4 py-1.5 text-sm font-medium transition-all text-slate-400 data-[state=active]:text-white"
                        style={
                          {
                            "--tw-data-active-bg": "rgba(30, 27, 75, 0.8)",
                          } as React.CSSProperties
                        }
                      >
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="px-4 py-1.5 text-sm font-medium transition-all text-slate-400 data-[state=active]:text-white"
                      >
                        Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {activeView === "preview" ? (
                    <div className="h-full" style={{ background: "rgba(2, 5, 16, 0.5)" }}>
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                      {/* File Tree */}
                      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                        <div
                          className="h-full"
                          style={{
                            background: "rgba(5, 10, 25, 0.7)",
                            borderRight: "1px solid rgba(129, 140, 248, 0.08)",
                          }}
                        >
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle
                        className="w-[1px] transition-colors"
                        style={{ background: "rgba(129, 140, 248, 0.08)" }}
                      />

                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                        <div className="h-full" style={{ background: "rgba(3, 7, 18, 0.9)" }}>
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
