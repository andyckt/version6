"use client";

import useSWR from 'swr';
import { User } from '@/data/users';
import { getUserByUsername } from '@/data/users';

const fetcher = async (username: string) => {
  const user = await getUserByUsername(username);
  if (!user) throw new Error('User not found');
  return user;
};

export function useUser(username: string) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    username ? `/api/users/${username}` : null,
    () => fetcher(username),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
} 