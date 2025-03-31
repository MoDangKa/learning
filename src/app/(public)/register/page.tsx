import dynamic from "next/dynamic";
const RegisterForm = dynamic(() => import("@/components/forms/RegisterForm"), {
  loading: () => <div>Loading...</div>,
});

export default function RegisterPage() {
  return <RegisterForm />;
}
