"use client";

import Script from "next/script";

export const ZadarmaScripts = () => {
  return (
    <>
      {/* Zadarma Click to Call Scripts */}
      <Script
        src="/zadarma-click-to-call/detectWebRTC.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log('detectWebRTC.min.js loaded')}
        onError={(e) => console.error('Failed to load detectWebRTC.min.js:', e)}
      />
      <Script
        src="/zadarma-click-to-call/jssip.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log('jssip.min.js loaded')}
        onError={(e) => console.error('Failed to load jssip.min.js:', e)}
      />
      <Script
        src="/zadarma-click-to-call/widget.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log('widget.min.js loaded - ZadarmaCallmeWidget available:', typeof (window as any).ZadarmaCallmeWidget)}
        onError={(e) => console.error('Failed to load widget.min.js:', e)}
      />
    </>
  );
};