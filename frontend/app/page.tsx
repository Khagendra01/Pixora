"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { AUTH_STORAGE_KEY, type StoredAuthPayload } from "@/lib/authStorage";
import { type ChatMessage } from "@/lib/chatMessages";
import {
  fetchChatSession,
  persistChatSession,
  resetChatSession,
} from "./actions/chatSessions";
import {
  type CommandResult,
  initializeChatAssets,
} from "./actions/createChatAssets";

const conversations = [
  { id: "c1", title: "Storyboard for launch film" },
  { id: "c2", title: "Palette exploration" },
  { id: "c3", title: "Render pipeline tips" },
  { id: "c4", title: "Client feedback digest" },
];

const defaultMessages: ChatMessage[] = [
  {
    id: "m1",
    author: "Pixora Studio",
    role: "assistant",
    content:
      "Welcome back. I pulled the latest moodboard notes and queued a new render preset based on your last session.",
    timestamp: "9:41 AM",
  },
  {
    id: "m2",
    author: "You",
    role: "user",
    content:
      "Great. Can you summarise the lighting adjustments from the director?",
    timestamp: "9:42 AM",
  },
  {
    id: "m3",
    author: "Pixora Studio",
    role: "assistant",
    content:
      "The director prefers warmer rim lighting, lowered ambient fill by 12%, and a soft highlight sweep from stage left. Want me to apply that to tonight's render batch?",
    timestamp: "9:43 AM",
  },
];

const ACCESS_CHECK_MESSAGE = "Preparing your studio...";

function formatTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready">("checking");
  const [fullName, setFullName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [draft, setDraft] = useState("");
  const [awaitingFirstMessage, setAwaitingFirstMessage] = useState(false);
  const [assetMessage, setAssetMessage] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [assetLogs, setAssetLogs] = useState<CommandResult[]>([]);
  const [isInitializingAssets, startInitializeAssets] = useTransition();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const payloadRaw = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (!payloadRaw) {
        router.replace("/login");
        return;
      }

      const payload = JSON.parse(payloadRaw) as StoredAuthPayload;

      if (!payload.loggedIn) {
        router.replace("/login");
        return;
      }

      setFullName(payload.user?.fullName ?? null);
      setUserEmail(payload.user?.email ?? null);
      setStatus("ready");
    } catch (error) {
      console.error("Failed to read auth payload", error);
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (status !== "ready" || !userEmail) {
      return;
    }

    let isActive = true;

    fetchChatSession(userEmail)
      .then((result) => {
        if (!isActive) {
          return;
        }

        if (result.status === "success" && result.messages.length > 0) {
          setMessages(result.messages);
          setAwaitingFirstMessage(false);
          return;
        }

        if (result.status === "error") {
          console.error(result.message);
        }

        setMessages(defaultMessages);
        setAwaitingFirstMessage(false);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        console.error("Failed to fetch chat session", error);
        setMessages(defaultMessages);
        setAwaitingFirstMessage(false);
      });

    return () => {
      isActive = false;
    };
  }, [status, userEmail]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear auth payload", error);
      }
    }
    router.push("/login");
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setDraft("");
    setAwaitingFirstMessage(true);
    setAssetMessage(null);
    setAssetError(null);
    setAssetLogs([]);

    if (userEmail) {
      void resetChatSession(userEmail);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      author: "You",
      role: "user",
      content: trimmed,
      timestamp: formatTimestamp(),
    };

    const nextMessages = [...messages, newMessage];
    setMessages(nextMessages);
    setDraft("");

    if (userEmail) {
      void persistChatSession({ email: userEmail, messages: nextMessages });
    }

    if (!awaitingFirstMessage) {
      return;
    }

    setAwaitingFirstMessage(false);
    setAssetMessage(null);
    setAssetError(null);
    setAssetLogs([]);

    if (!userEmail) {
      setAssetError("We couldn't derive your user email. Please log in again.");
      return;
    }

    startInitializeAssets(() => {
      initializeChatAssets({ email: userEmail, firstMessage: trimmed })
        .then((result) => {
          if (result.status === "success") {
            setAssetMessage(
              `Video template prepared at ${result.relativePath}`,
            );
            setAssetLogs(result.commandLogs ?? []);
          } else {
            setAssetError(
              result.message ?? "We couldn't prepare your video template.",
            );
            setAssetLogs(result.commandLogs ?? []);
          }
        })
        .catch((error) => {
          console.error("Failed to initialize chat assets", error);
          setAssetError("We couldn't prepare your video template.");
          setAssetLogs([]);
        });
    });
  };

  const displayName = (fullName ?? "Creator").split(" ")[0];

  if (status !== "ready") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#07070b] text-white">
        <div className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/60 shadow-[0_18px_32px_rgba(0,0,0,0.45)] backdrop-blur-[24px]">
          {ACCESS_CHECK_MESSAGE}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(120,120,255,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-40%] h-full w-[80%] -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-12 sm:flex-row sm:gap-10 sm:px-10">
        <aside className="w-full shrink-0 sm:max-w-xs">
          <div className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-[32px]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Pixora
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Studio Concierge
              </h1>
              <p className="text-sm text-white/60">
                Glide between chat, briefs, and playback with the polish of an
                Apple flagship app.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartNewChat}
              className="flex items-center justify-center gap-2 rounded-[22px] border border-white/20 bg-white px-4 py-2 text-sm font-medium tracking-tight text-black transition hover:bg-white/90"
            >
              <span className="text-lg leading-none text-black/60">+</span>
              New chat
            </button>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                Recent conversations
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                {conversations.map((conversation) => (
                  <li
                    key={conversation.id}
                    className="rounded-[20px] border border-transparent bg-white/0 px-4 py-3 transition hover:border-white/20 hover:bg-white/10"
                  >
                    {conversation.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/40 p-4 text-xs text-white/50">
              <p className="font-semibold text-white/70">Hand-off ready</p>
              <p className="mt-1">
                Sync renders, notes, and approvals through a single dashboard
                tailored for your team.
              </p>
            </div>
          </div>
        </aside>
        <section className="flex flex-1 flex-col gap-6 rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_60px_rgba(0,0,0,0.45)] backdrop-blur-[32px] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Welcome back, {displayName}
              </p>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Realtime review hub
              </h2>
              <p className="text-sm text-white/60">
                Review the latest cut, annotate in real time, and keep your
                creative direction laser sharp.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-[20px] border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Playback synced
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-[18px] border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/60">
            <video
              className="h-full w-full object-cover"
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              controls
              preload="metadata"
              poster="https://images.apple.com/v/home/bs/images/heroes/iphone-16-pro/hero_iphone16pro__bnmxu07m4bci_largetall.jpg"
            >
              <track
                default
                kind="captions"
                src="/captions/studio.vtt"
                srcLang="en"
                label="English"
              />
            </video>
          </div>
          <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-[30px] border border-white/10 bg-black/45 p-6">
            <div className="space-y-4 overflow-y-auto pr-1 text-sm text-white/80">
              {messages.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-white/15 bg-white/5 p-6 text-center text-xs uppercase tracking-[0.2em] text-white/40">
                  Starting a fresh conversation
                </div>
              ) : null}
              {messages.map((message) => (
                <article
                  key={message.id}
                  className="flex flex-col gap-1 rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="font-medium text-white/70">
                      {message.author}
                    </span>
                    <span>{message.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">
                    {message.content}
                  </p>
                </article>
              ))}
            </div>
            {isInitializingAssets ? (
              <div className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-3 text-xs text-white/60">
                Preparing your template assets...
              </div>
            ) : null}
            {assetMessage ? (
              <div className="rounded-[20px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200">
                {assetMessage}
              </div>
            ) : null}
            {assetError ? (
              <div className="rounded-[20px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                {assetError}
              </div>
            ) : null}
            {assetLogs.length > 0 ? (
              <div className="rounded-[20px] border border-white/15 bg-white/5 p-4 text-xs text-white/70">
                <p className="font-semibold text-white/80">Setup commands</p>
                <div className="mt-3 space-y-3">
                  {assetLogs.map((log) => (
                    <div key={log.command} className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {log.command}
                      </p>
                      {log.stdout ? (
                        <pre className="whitespace-pre-wrap rounded-[12px] bg-black/40 p-3 text-[11px] text-white/70">
                          {log.stdout}
                        </pre>
                      ) : null}
                      {log.stderr ? (
                        <pre className="whitespace-pre-wrap rounded-[12px] bg-red-500/10 p-3 text-[11px] text-red-200">
                          {log.stderr}
                        </pre>
                      ) : null}
                      <p className="text-[11px] text-white/40">
                        Exit code: {log.exitCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4"
            >
              <label
                className="text-xs uppercase tracking-[0.2em] text-white/40"
                htmlFor="reply-input"
              >
                Compose reply
              </label>
              <textarea
                id="reply-input"
                rows={3}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Sketch your next prompt with Apple-grade polish..."
                className="w-full resize-none rounded-[18px] border border-white/20 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40 focus:bg-black/40"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  Draft saved just now
                </div>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-[18px] border border-white/20 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
