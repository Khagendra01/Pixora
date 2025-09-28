"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import type { CommandResult } from "@/app/actions/agent";
import {
  createChatSessionAction,
  fetchChatSession,
  persistChatSession,
} from "@/app/actions/chatSessions";
import {
  initializeChatAssets,
  runCodexInExistingAssets,
} from "@/app/actions/createChatAssets";
import type { HomeContent } from "@/lib/appContent";
import { AUTH_STORAGE_KEY, type StoredAuthPayload } from "@/lib/authStorage";
import type { ChatMessage, ChatSessionSummary } from "@/lib/chatMessages";
import { RemotionPreview } from "./RemotionPreview";

function formatTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HomeClient({ content }: { content: HomeContent }) {
  const router = useRouter();
  const defaultMessages = content.chatPanel.initialMessages;
  const [status, setStatus] = useState<"checking" | "ready">("checking");
  const [fullName, setFullName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    ...defaultMessages,
  ]);
  const [draft, setDraft] = useState("");
  const [awaitingFirstMessage, setAwaitingFirstMessage] = useState(false);
  const [assetMessage, setAssetMessage] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [assetLogs, setAssetLogs] = useState<CommandResult[]>([]);
  const [assetFolder, setAssetFolder] = useState<string | null>(null);
  const [isInitializingAssets, startInitializeAssets] = useTransition();
  const [showRemotionPreview, setShowRemotionPreview] = useState(false);

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

        if (result.status === "success") {
          setSessions(result.sessions);

          if (result.activeSession) {
            setActiveSessionId(result.activeSession.id);
            const sessionMessages = result.activeSession.messages;
            const hasMessages = sessionMessages.length > 0;
            setMessages(hasMessages ? sessionMessages : [...defaultMessages]);
            setAwaitingFirstMessage(!hasMessages);
            setAssetFolder(result.activeSession.assetRelativePath ?? null);
            return;
          }

          setActiveSessionId(null);
          setMessages([...defaultMessages]);
          setAwaitingFirstMessage(false);
          setAssetFolder(null);
          return;
        }

        if (result.status === "error") {
          console.error(result.message);
        }

        setSessions([]);
        setActiveSessionId(null);
        setMessages([...defaultMessages]);
        setAwaitingFirstMessage(false);
        setAssetFolder(null);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        console.error("Failed to fetch chat session", error);
        setSessions([]);
        setActiveSessionId(null);
        setMessages([...defaultMessages]);
        setAwaitingFirstMessage(false);
        setAssetFolder(null);
      });

    return () => {
      isActive = false;
    };
  }, [defaultMessages, status, userEmail]);

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
    if (!userEmail) {
      setAssetError(content.chatPanel.missingEmailError);
      return;
    }

    setActiveSessionId(null);
    setMessages([]);
    setDraft("");
    setAwaitingFirstMessage(true);
    setAssetMessage(null);
    setAssetError(null);
    setAssetLogs([]);
    setAssetFolder(null);
  };

  const handleSelectSession = (sessionId: string) => {
    if (!userEmail || sessionId === activeSessionId) {
      return;
    }

    setAssetMessage(null);
    setAssetError(null);
    setAssetLogs([]);

    fetchChatSession(userEmail, sessionId)
      .then((result) => {
        if (result.status !== "success") {
          if (result.status === "error") {
            console.error(result.message);
          }
          return;
        }

        setSessions(result.sessions);

        if (!result.activeSession) {
          return;
        }

        setActiveSessionId(result.activeSession.id);
        const sessionMessages = result.activeSession.messages;
        const hasMessages = sessionMessages.length > 0;
        setMessages(hasMessages ? sessionMessages : [...defaultMessages]);
        setAwaitingFirstMessage(!hasMessages);
        setAssetFolder(result.activeSession.assetRelativePath ?? null);
        setDraft("");
      })
      .catch((error) => {
        console.error("Failed to switch chat session", error);
      });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    if (!userEmail) {
      setAssetError(content.chatPanel.missingEmailError);
      return;
    }

    let resolvedSessionId = activeSessionId;
    let isFirstMessage = awaitingFirstMessage;

    if (!resolvedSessionId) {
      try {
        const creationResult = await createChatSessionAction({
          email: userEmail,
        });

        if (creationResult.status === "success") {
          resolvedSessionId = creationResult.session.id;
          setActiveSessionId(creationResult.session.id);
          setSessions(creationResult.sessions);
          isFirstMessage = true;
          setAwaitingFirstMessage(true);
        } else if (creationResult.status === "error") {
          setAssetError(
            creationResult.message ??
              content.chatPanel.assetPreparationFailureFallback,
          );
          return;
        }
      } catch (error) {
        console.error("Failed to create chat session", error);
        setAssetError(content.chatPanel.assetPreparationFailureFallback);
        return;
      }
    }

    if (!resolvedSessionId) {
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

    void persistChatSession({
      email: userEmail,
      sessionId: resolvedSessionId,
      messages: nextMessages,
      assetRelativePath: assetFolder,
    })
      .then((result) => {
        if (result.status === "success") {
          setSessions((current) => {
            const others = current.filter(
              (session) => session.id !== result.session.id,
            );

            return [
              {
                id: result.session.id,
                title: result.session.title,
                createdAt: result.session.createdAt,
                updatedAt: result.session.updatedAt,
              },
              ...others,
            ];
          });
          setActiveSessionId(result.session.id);
          setAssetFolder(result.session.assetRelativePath ?? null);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Failed to persist chat session", error);
      });

    if (!isFirstMessage) {
      if (assetFolder) {
        setAssetMessage(null);
        setAssetError(null);
        setAssetLogs([]);

        startInitializeAssets(() => {
          runCodexInExistingAssets({
            relativePath: assetFolder,
            message: trimmed,
          })
            .then((result) => {
              if (result.status === "success") {
                setAssetMessage(
                  `${content.chatPanel.assetExecutionSuccessPrefix} ${assetFolder}.`,
                );
                setAssetLogs(result.commandLogs ?? []);
              } else {
                setAssetError(
                  result.message ??
                    content.chatPanel.codexCommandFailureFallback,
                );
                setAssetLogs(result.commandLogs ?? []);
              }
            })
            .catch((error) => {
              console.error("Failed to run codex command", error);
              setAssetError(content.chatPanel.codexCommandFailureFallback);
              setAssetLogs([]);
            });
        });
      }

      return;
    }

    setAwaitingFirstMessage(false);
    setAssetMessage(null);
    setAssetError(null);
    setAssetLogs([]);

    startInitializeAssets(() => {
      initializeChatAssets({ email: userEmail, firstMessage: trimmed })
        .then((result) => {
          if (result.status === "success") {
            setAssetMessage(
              `${content.chatPanel.assetPreparationSuccessPrefix} ${result.relativePath}`,
            );
            setAssetLogs(result.commandLogs ?? []);
            setAssetFolder(result.relativePath);

            void persistChatSession({
              email: userEmail,
              sessionId: resolvedSessionId,
              messages: [...nextMessages],
              assetRelativePath: result.relativePath,
            });
          } else {
            setAssetError(
              result.message ??
                content.chatPanel.assetPreparationFailureFallback,
            );
            setAssetLogs(result.commandLogs ?? []);
          }
        })
        .catch((error) => {
          console.error("Failed to initialize chat assets", error);
          setAssetError(content.chatPanel.assetPreparationFailureFallback);
          setAssetLogs([]);
        });
    });
  };

  const displayName = (fullName ?? "Creator").split(" ")[0];
  const newChatIcon = content.sidebar.newChat.icon ?? "+";

  if (status !== "ready") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#07070b] text-white">
        <div className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/60 shadow-[0_18px_32px_rgba(0,0,0,0.45)] backdrop-blur-[24px]">
          {content.accessCheckMessage}
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
                {content.sidebar.productTag}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                {content.sidebar.title}
              </h1>
              <p className="text-sm text-white/60">
                {content.sidebar.description}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartNewChat}
              className="flex items-center justify-center gap-2 rounded-[22px] border border-white/20 bg-white px-4 py-2 text-sm font-medium tracking-tight text-black transition hover:bg-white/90"
            >
              <span className="text-lg leading-none text-black/60">
                {newChatIcon}
              </span>
              {content.sidebar.newChat.label}
            </button>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                {content.sidebar.recentConversationsLabel}
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                {sessions.length === 0 ? (
                  <li className="rounded-[20px] border border-dashed border-white/10 px-4 py-3 text-white/50">
                    No recent conversations yet.
                  </li>
                ) : (
                  sessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const itemClasses = isActive
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-transparent bg-white/0 text-white/70";

                    return (
                      <li key={session.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSession(session.id)}
                          className={`w-full rounded-[20px] border px-4 py-3 text-left transition hover:border-white/20 hover:bg-white/10 ${itemClasses}`}
                        >
                          <span className="block truncate font-medium">
                            {session.title}
                          </span>
                          <span className="mt-1 block text-xs text-white/50">
                            {new Date(session.updatedAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/40 p-4 text-xs text-white/50">
              <p className="font-semibold text-white/70">
                {content.sidebar.promo.title}
              </p>
              <p className="mt-1">{content.sidebar.promo.description}</p>
            </div>
          </div>
        </aside>
        <section className="flex flex-1 flex-col gap-6 rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_60px_rgba(0,0,0,0.45)] backdrop-blur-[32px] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                {content.header.welcomePrefix}, {displayName}
              </p>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {content.header.headline}
              </h2>
              <p className="text-sm text-white/60">
                {content.header.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-[20px] border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {content.header.playbackStatus}
              </div>
              <button
                type="button"
                onClick={() => setShowRemotionPreview(!showRemotionPreview)}
                className="rounded-[18px] border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
              >
                {showRemotionPreview ? 'Show Video' : 'Show Preview'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-[18px] border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
              >
                {content.header.logoutLabel}
              </button>
            </div>
          </div>
          {showRemotionPreview ? (
            <RemotionPreview projectPath={assetFolder} />
          ) : (
            <div className="aspect-video w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/60">
              <video
                className="h-full w-full object-cover"
                src={content.video.src}
                controls
                preload="metadata"
                poster={content.video.poster}
              >
                <track
                  default={content.video.track.default}
                  kind="captions"
                  src={content.video.track.src}
                  srcLang={content.video.track.srcLang}
                  label={content.video.track.label}
                />
              </video>
            </div>
          )}
          <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-[30px] border border-white/10 bg-black/45 p-6">
            <div className="space-y-4 overflow-y-auto pr-1 text-sm text-white/80">
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
                {content.chatPanel.preparingAssetsMessage}
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
                <p className="font-semibold text-white/80">
                  {content.chatPanel.assetLogsHeading}
                </p>
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
                        {content.chatPanel.exitCodeLabel}: {log.exitCode}
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
                {content.composer.label}
              </label>
              <textarea
                id="reply-input"
                rows={3}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={content.composer.placeholder}
                className="w-full resize-none rounded-[18px] border border-white/20 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40 focus:bg-black/40"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  {content.composer.draftSavedStatus}
                </div>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-[18px] border border-white/20 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {content.composer.submitLabel}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
