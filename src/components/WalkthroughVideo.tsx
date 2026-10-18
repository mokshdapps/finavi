import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import englishVideo from "@/assets/videos/guided-en.mp4.asset.json";
import spanishVideo from "@/assets/videos/guided-es.mp4.asset.json";
import poster from "@/assets/videos/guided-poster.jpg.asset.json";
import englishCaptions from "@/assets/videos/guided-en.vtt.asset.json";
import spanishCaptions from "@/assets/videos/guided-es.vtt.asset.json";

const assetUrl = (url: string) => new URL(url, "https://gofinavi.com").href;

export function WalkthroughVideo() {
  const { t, lang } = useI18n();
  const [failed, setFailed] = useState(false);
  const walkthrough = lang === "es" ? spanishVideo : englishVideo;
  const captions = lang === "es" ? spanishCaptions : englishCaptions;

  return (
    <div>
      <video
        key={lang}
        controls
        playsInline
        crossOrigin="anonymous"
        preload="none"
        poster={assetUrl(poster.url)}
        className="aspect-video w-full rounded-md bg-muted"
        aria-label={t("journey.videoTitle")}
        onError={() => setFailed(true)}
        onLoadedMetadata={(event) => {
          event.currentTarget.defaultPlaybackRate = 1;
          event.currentTarget.playbackRate = 1;
          for (const track of event.currentTarget.textTracks) {
            track.mode = "disabled";
          }
        }}
        onLoadedData={() => setFailed(false)}
      >
        <source src={assetUrl(walkthrough.url)} type="video/mp4" />
        <track
          src={assetUrl(captions.url)}
          kind="captions"
          srcLang={lang}
          label={lang === "es" ? "Español" : "English"}
        />
      </video>
      <p
        className="mt-3 text-xs leading-relaxed text-muted-foreground"
        role={failed ? "status" : undefined}
      >
        {t(failed ? "journey.videoError" : "journey.videoNote")}
      </p>
    </div>
  );
}
