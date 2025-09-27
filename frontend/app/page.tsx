const conversations = [
  { id: "c1", title: "Storyboard for launch film" },
  { id: "c2", title: "Palette exploration" },
  { id: "c3", title: "Render pipeline tips" },
  { id: "c4", title: "Client feedback digest" },
];

const chatMessages = [
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

export default function Home() {
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
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Realtime review hub
              </h2>
              <p className="text-sm text-white/60">
                Review the latest cut, annotate in real time, and keep your
                creative direction laser sharp.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-[20px] border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Playback synced
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
              {chatMessages.map((message) => (
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
            <form className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <label
                className="text-xs uppercase tracking-[0.2em] text-white/40"
                htmlFor="reply-input"
              >
                Compose reply
              </label>
              <textarea
                id="reply-input"
                rows={3}
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
                  className="rounded-[18px] border border-white/20 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
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
