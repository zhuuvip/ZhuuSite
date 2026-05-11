import { useEffect, useRef } from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import OceanCanvas from "@/components/OceanCanvas";
import MusicPlayer from "@/components/MusicPlayer";
import ZhuuAIChat from "@/components/ZhuuAIChat";
import Home from "@/pages/Home";
import SpeedTest from "@/pages/SpeedTest";
import Portfolio from "@/pages/Portfolio";
import Community from "@/pages/Community";
import Links from "@/pages/Links";
import Feedback from "@/pages/Feedback";
import AIPage from "@/pages/AIPage";
import Linktree from "@/pages/Linktree";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL || undefined;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

const clerkAppearance = {
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#00e5ff",
    colorForeground: "#e0f7fa",
    colorMutedForeground: "rgba(0,200,220,0.55)",
    colorDanger: "#ff6b6b",
    colorBackground: "#020c18",
    colorInput: "rgba(0,20,40,0.8)",
    colorInputForeground: "#e0f7fa",
    colorNeutral: "rgba(0,200,220,0.25)",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    borderRadius: "12px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl w-[420px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !rounded-none !bg-transparent",
    footer: "!shadow-none !border-0 !rounded-none !bg-transparent",
    headerTitle: "text-cyan-300 font-bold",
    headerSubtitle: "text-cyan-400/60",
    socialButtonsBlockButtonText: "text-cyan-200/80",
    formFieldLabel: "text-cyan-300/70",
    footerActionLink: "text-cyan-400 hover:text-cyan-200",
    footerActionText: "text-cyan-400/50",
    dividerText: "text-cyan-400/40",
    identityPreviewEditButton: "text-cyan-400",
    formFieldSuccessText: "text-green-400",
    alertText: "text-red-400",
    logoBox: "flex justify-center mb-2",
    logoImage: "h-12 w-12 rounded-full",
    socialButtonsBlockButton: "border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 text-cyan-200",
    formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold",
    formFieldInput: "bg-white/5 border-cyan-400/20 text-cyan-100 placeholder:text-cyan-400/30",
    footerAction: "border-t border-cyan-400/10",
    dividerLine: "bg-cyan-400/15",
    otpCodeFieldInput: "bg-white/5 border-cyan-400/25 text-cyan-100",
    main: "gap-4",
  },
};

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center ocean-bg">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🌊</div>
        <h1 className="text-7xl font-black gradient-text mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>404</h1>
        <p className="mb-8" style={{ color: "rgba(0,200,220,0.5)", fontSize: 18 }}>Lost in the deep ocean...</p>
        <a href="/" className="neon-btn-solid px-8 py-3 rounded-full font-semibold inline-block">← Surface</a>
      </div>
    </div>
  );
}

function SignInPage() {
  return (
    <div className="min-h-screen ocean-bg flex items-center justify-center px-4 pt-16 pb-24">
      <div style={{
        background: "rgba(2,12,24,0.95)", border: "1px solid rgba(0,200,220,0.2)",
        borderRadius: 24, padding: "8px", backdropFilter: "blur(24px)",
        boxShadow: "0 0 60px rgba(0,200,220,0.1), 0 0 120px rgba(0,100,150,0.08)",
      }}>
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-screen ocean-bg flex items-center justify-center px-4 pt-16 pb-24">
      <div style={{
        background: "rgba(2,12,24,0.95)", border: "1px solid rgba(0,200,220,0.2)",
        borderRadius: 24, padding: "8px", backdropFilter: "blur(24px)",
        boxShadow: "0 0 60px rgba(0,200,220,0.1), 0 0 120px rgba(0,100,150,0.08)",
      }}>
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function ClerkCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const uid = user?.id ?? null;
      if (prevRef.current !== undefined && prevRef.current !== uid) qc.clear();
      prevRef.current = uid;
    });
    return unsub;
  }, [addListener, qc]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/speedtest" component={SpeedTest} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/community" component={Community} />
      <Route path="/links" component={Links} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/ai" component={AIPage} />
      <Route path="/linktree" component={Linktree} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkCacheInvalidator />
        <TooltipProvider>
          <OceanCanvas />
          <div className="relative" style={{ zIndex: 1 }}>
            <Navbar />
            <main>
              <Router />
            </main>
            <BottomNav />
          </div>
          <MusicPlayer />
          <ZhuuAIChat />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
