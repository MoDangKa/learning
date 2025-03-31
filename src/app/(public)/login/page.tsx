import dynamic from "next/dynamic";
const LoginForm = dynamic(() => import("@/components/forms/LoginForm"), {
  loading: () => <div>Loading...</div>,
});

export default function LoginPage() {
  return <LoginForm />;
}
