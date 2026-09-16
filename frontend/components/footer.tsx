import Image from "next/image";
import tuwaiqLogo from "@/public/tuwaiq-academy-logo.png";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background px-4 py-5">
      <div className="relative mx-auto h-16 w-64 overflow-hidden">
        <Image
          src={tuwaiqLogo}
          alt="Tuwaiq Academy"
          width={320}
          height={320}
          sizes="320px"
          className="absolute top-1/2 left-1/2 w-80 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </footer>
  );
}
