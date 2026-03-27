import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cm-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cm-cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-white/90 border-t border-white/10 p-4 shadow-lg">
      <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm font-sans leading-relaxed max-w-2xl">
          We use essential cookies to ensure this site functions properly. No tracking cookies are used.
          By continuing to browse, you accept our{" "}
          <a href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </a>
          .
        </p>
        <button
          onClick={accept}
          className="px-5 py-2 text-sm font-sans font-medium bg-heather text-white rounded-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
