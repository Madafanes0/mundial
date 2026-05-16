"use client";

import { useCallback, useState } from "react";
import { getFlagEmojiFallback, getFlagImageUrl } from "@/data/fifa-flagcdn";

interface TeamFlagProps {
  fifaCode: string;
  countryName: string;
  size?: number;
}

export function TeamFlag({ fifaCode, countryName, size = 88 }: TeamFlagProps) {
  const [hideImg, setHideImg] = useState(false);
  const src = getFlagImageUrl(fifaCode);
  const emoji = getFlagEmojiFallback(fifaCode);

  const onImgError = useCallback(() => {
    setHideImg(true);
  }, []);

  const boxStyle = {
    width: size,
    aspectRatio: "4 / 3",
  } as const;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/15 bg-white shadow-md dark:border-white/20 dark:bg-zinc-900"
      style={boxStyle}
      aria-label={`Bandera ${countryName}`}
      role="img"
    >
      <span
        className="pointer-events-none select-none text-[2.5rem] leading-none sm:text-[3rem]"
        aria-hidden
      >
        {emoji}
      </span>
      {!hideImg ? (
        <img
          src={src}
          alt=""
          width={size}
          height={Math.round((size * 3) / 4)}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
          onError={onImgError}
        />
      ) : null}
    </div>
  );
}
