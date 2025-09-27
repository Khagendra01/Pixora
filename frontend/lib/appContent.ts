import type { ChatMessage } from "@/lib/chatMessages";

export type ConversationSummary = {
  id: string;
  title: string;
};

export type VideoTrackInfo = {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
};

export type SidebarContent = {
  productTag: string;
  title: string;
  description: string;
  newChat: {
    icon?: string;
    label: string;
  };
  recentConversationsLabel: string;
  conversations: ConversationSummary[];
  promo: {
    title: string;
    description: string;
  };
};

export type HeaderContent = {
  welcomePrefix: string;
  headline: string;
  description: string;
  playbackStatus: string;
  logoutLabel: string;
};

export type VideoContent = {
  src: string;
  poster: string;
  track: VideoTrackInfo;
};

export type ChatPanelContent = {
  emptyStatePrompt: string;
  initialMessages: ChatMessage[];
  preparingAssetsMessage: string;
  assetLogsHeading: string;
  exitCodeLabel: string;
  assetPreparationSuccessPrefix: string;
  assetExecutionSuccessPrefix: string;
  codexCommandFailureFallback: string;
  assetPreparationFailureFallback: string;
  missingEmailError: string;
};

export type ComposerContent = {
  label: string;
  placeholder: string;
  draftSavedStatus: string;
  submitLabel: string;
};

export type HomeContent = {
  accessCheckMessage: string;
  sidebar: SidebarContent;
  header: HeaderContent;
  video: VideoContent;
  chatPanel: ChatPanelContent;
  composer: ComposerContent;
};

export type AuthLayoutContent = {
  brand: string;
  navLinks: { href: string; label: string }[];
  footer: string;
};

export type AuthCardContent = {
  title: string;
  subtitle?: string;
  accent?: {
    prompt: string;
    href: string;
    linkLabel: string;
  };
};

export type LoginPageContent = AuthCardContent & {
  learnMore?: {
    href: string;
    label: string;
  };
};

export type RegisterPageContent = AuthCardContent;

export type LoginFormContent = {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
};

export type RegisterFormContent = {
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
};

export type SubmitButtonContent = {
  pendingLabel: string;
  pendingIndicator: string;
  idleIndicator: string;
};

export type AuthContent = {
  layout: AuthLayoutContent;
  login: LoginPageContent;
  register: RegisterPageContent;
  forms: {
    login: LoginFormContent;
    register: RegisterFormContent;
    submitButton: SubmitButtonContent;
  };
};

export type AppContent = {
  home: HomeContent;
  auth: AuthContent;
};

export const DEFAULT_APP_CONTENT: AppContent = {
  home: {
    accessCheckMessage: "Preparing your studio...",
    sidebar: {
      productTag: "Pixora",
      title: "Studio Concierge",
      description:
        "Glide between chat, briefs, and playback with the polish of an Apple flagship app.",
      newChat: {
        icon: "+",
        label: "New chat",
      },
      recentConversationsLabel: "Recent conversations",
      conversations: [
        { id: "c1", title: "Storyboard for launch film" },
        { id: "c2", title: "Palette exploration" },
        { id: "c3", title: "Render pipeline tips" },
        { id: "c4", title: "Client feedback digest" },
      ],
      promo: {
        title: "Hand-off ready",
        description:
          "Sync renders, notes, and approvals through a single dashboard tailored for your team.",
      },
    },
    header: {
      welcomePrefix: "Welcome back",
      headline: "Realtime review hub",
      description:
        "Review the latest cut, annotate in real time, and keep your creative direction laser sharp.",
      playbackStatus: "Playback synced",
      logoutLabel: "Logout",
    },
    video: {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster:
        "https://images.apple.com/v/home/bs/images/heroes/iphone-16-pro/hero_iphone16pro__bnmxu07m4bci_largetall.jpg",
      track: {
        src: "/captions/studio.vtt",
        srcLang: "en",
        label: "English",
        default: true,
      },
    },
    chatPanel: {
      emptyStatePrompt: "Starting a fresh conversation",
      initialMessages: [
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
      ],
      preparingAssetsMessage: "Preparing your template assets...",
      assetLogsHeading: "Setup commands",
      exitCodeLabel: "Exit code",
      assetPreparationSuccessPrefix: "Video template prepared at",
      assetExecutionSuccessPrefix: "Codex command executed in",
      codexCommandFailureFallback: "We couldn't run the `codex` command.",
      assetPreparationFailureFallback:
        "We couldn't prepare your video template.",
      missingEmailError:
        "We couldn't derive your user email. Please log in again.",
    },
    composer: {
      label: "Compose reply",
      placeholder: "Sketch your next prompt with Apple-grade polish...",
      draftSavedStatus: "Draft saved just now",
      submitLabel: "Send",
    },
  },
  auth: {
    layout: {
      brand: "Pixora",
      navLinks: [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ],
      footer: "Inspired by the elegance of Apple - crafted for Pixora.",
    },
    login: {
      title: "Sign in with Pixora",
      subtitle: "Your creative hub, reimagined with Apple-inspired clarity.",
      accent: {
        prompt: "New to Pixora?",
        href: "/register",
        linkLabel: "Create an account",
      },
      learnMore: {
        href: "/",
        label: "Learn more about Pixora >",
      },
    },
    register: {
      title: "Create your Pixora ID",
      subtitle: "A seamless sign-up wrapped in Apple-inspired polish.",
      accent: {
        prompt: "Already joined?",
        href: "/login",
        linkLabel: "Sign in",
      },
    },
    forms: {
      login: {
        emailLabel: "Email",
        emailPlaceholder: "you@pixora.com",
        passwordLabel: "Password",
        passwordPlaceholder: "********",
        submitLabel: "Sign in",
      },
      register: {
        fullNameLabel: "Full name",
        fullNamePlaceholder: "Jamie Appleseed",
        emailLabel: "Email",
        emailPlaceholder: "you@pixora.com",
        passwordLabel: "Password",
        passwordPlaceholder: "Create a password",
        submitLabel: "Create account",
      },
      submitButton: {
        pendingLabel: "Please wait...",
        pendingIndicator: "..",
        idleIndicator: ">",
      },
    },
  },
};
