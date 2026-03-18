"use client";

import { GoogleAnalytics } from "./GoogleAnalytics";
import { FacebookPixel } from "./FacebookPixel";
import { TikTokPixel } from "./TikTokPixel";
import { SnapchatPixel } from "./SnapchatPixel";
import { MicrosoftClarity } from "./MicrosoftClarity";
import { OmnisendTracking } from "./OmnisendTracking";
import { GoogleTagManager } from "./GoogleTagManager";

interface TrackingScriptsProps {
  gaId?: string;
  googleAdsId?: string;
  fbPixelId?: string;
  tiktokPixelId?: string;
  snapPixelId?: string;
  clarityId?: string;
  omnisendBrandId?: string;
  gtmId?: string;
}

export function TrackingScripts({
  gaId,
  googleAdsId,
  fbPixelId,
  tiktokPixelId,
  snapPixelId,
  clarityId,
  omnisendBrandId,
  gtmId,
}: TrackingScriptsProps){
  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} googleAdsId={googleAdsId} />}
      {fbPixelId && <FacebookPixel pixelId={fbPixelId} />}
      {tiktokPixelId && <TikTokPixel pixelId={tiktokPixelId} />}
      {snapPixelId && <SnapchatPixel pixelId={snapPixelId} />}
      {clarityId && <MicrosoftClarity clarityId={clarityId} />}
      {omnisendBrandId && <OmnisendTracking brandId={omnisendBrandId} />}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </>
  );
}
