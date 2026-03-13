"use client";

import { GoogleAnalytics } from "./GoogleAnalytics";
import { FacebookPixel } from "./FacebookPixel";
import { TikTokPixel } from "./TikTokPixel";
import { SnapchatPixel } from "./SnapchatPixel";
import { MicrosoftClarity } from "./MicrosoftClarity";
import { GoogleTagManager } from "./GoogleTagManager";

interface TrackingScriptsProps {
  gaId?: string;
  googleAdsId?: string;
  fbPixelId?: string;
  tiktokPixelId?: string;
  snapPixelId?: string;
  clarityId?: string;
  gtmId?: string;
}

export function TrackingScripts({
  gaId,
  googleAdsId,
  fbPixelId,
  tiktokPixelId,
  snapPixelId,
  clarityId,
  gtmId,
}: TrackingScriptsProps){
  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} googleAdsId={googleAdsId} />}
      {fbPixelId && <FacebookPixel pixelId={fbPixelId} />}
      {tiktokPixelId && <TikTokPixel pixelId={tiktokPixelId} />}
      {snapPixelId && <SnapchatPixel pixelId={snapPixelId} />}
      {clarityId && <MicrosoftClarity clarityId={clarityId} />}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </>
  );
}
