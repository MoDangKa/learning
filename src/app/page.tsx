import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-2 p-5 max-w-xs w-full bg-slate-800 rounded-lg text-white">
        <div className="text-center my-4">
          <h1 className="text-3xl font-light text-slate-200">
            Learning Project
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className=" bg-slate-900 p-3 rounded-lg block text-center text-slate-400"
          >
            Login
          </Link>
          <Link
            href="/register"
            className=" bg-slate-900 p-3 rounded-lg block text-center text-slate-400"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
