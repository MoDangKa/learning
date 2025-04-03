"use client";
import UserCard from "@/components/UserCard";
import { UsersResponseData } from "@/interfaces/api/user";
import useSWR from "swr";

export default function UsersBPage() {
  const { data, error, isLoading } = useSWR<UsersResponseData>("/api/users");

  if (error) return <div>filed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <ul className="">
      {data?.users.map((user) => (
        <UserCard key={user.id} data={user} />
      ))}
    </ul>
  );
}
