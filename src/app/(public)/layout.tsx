import { PropsWithChildren } from "react";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen max-w-md items-center justify-center m-auto">
      {children}
    </main>
  );
}
