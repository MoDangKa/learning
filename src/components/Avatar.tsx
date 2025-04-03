import Image from "next/image";
import { Fragment } from "react";

type Props = { src?: string; alt: string; size?: number };

function Avatar({ src, alt, size = 50 }: Props) {
  return (
    <div
      className="bg-slate-600 rounded-full overflow-hidden object-cover relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
      }}
    >
      {src ? (
        <Image
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
          alt={alt}
          src={src}
          width={size}
          height={size}
        />
      ) : (
        <Fragment />
      )}
    </div>
  );
}

export default Avatar;
