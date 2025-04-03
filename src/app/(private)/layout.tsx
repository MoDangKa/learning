"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  loading: () => <div>Loading...</div>,
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function PrivateLayout({ children }: PropsWithChildren) {
  return (
    <SWRConfig value={{ fetcher }}>
      <div className="flex flex-col items-center justify-center gap-2 min-h-screen max-w-md my-3 mx-auto">
        <Navbar />
        <div className="w-full p-5 basic-card">{children}</div>
      </div>
    </SWRConfig>
  );
}
