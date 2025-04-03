import { User } from "@/interfaces/api/user";
import Avatar from "./Avatar";

type UserProps = {
  data: User;
};

export default function UserCard({ data }: UserProps) {
  return (
    <div className="flex flex-row gap-3 items-center mb-4 last:mb-0">
      <Avatar alt={data.name} src={data.photo} />
      <div className="text-slate-200">{data.name}</div>
    </div>
  );
}
