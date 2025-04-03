"use client";
import UserCard from "@/components/UserCard";
import { User, UsersResponseData } from "@/interfaces/api/user";
import apiService from "@/lib/apiService";
import { useEffect, useState } from "react";

export default function UsersAPage() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await apiService<UsersResponseData>({
        method: "GET",
        url: "/api/users",
      });
      if (response.success) {
        setData(response.data.users);
      }
    };
    fetch();
  }, []);

  if (!data.length) return <div>loading...</div>;

  return (
    <ul>
      {data.map((user) => (
        <UserCard key={user.id} data={user} />
      ))}
    </ul>
  );
}
