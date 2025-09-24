// src/hooks/dummyjson-users.ts
// React Query hooks for DummyJSON Users API
// Docs: https://dummyjson.com/

import { useQuery, useInfiniteQuery, QueryClient } from "@tanstack/react-query";

/** --------------------
 * Types (matching DummyJSON)
 * -------------------- */
export type Hair = { color: string; type: string };
export type Coordinates = { lat: number; lng: number };
export type Address = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
};
export type CompanyAddress = Address;
export type Company = {
  department: string;
  name: string;
  title: string;
  address: CompanyAddress;
};
export type Bank = {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
};
export type Crypto = {
  coin: string;
  wallet: string;
  network: string;
};
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
};

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

/** --------------------
 * Low-level API helpers
 * -------------------- */
const BASE_URL = "https://dummyjson.com";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url); // removed Next.js-specific 'next' hint
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export type ListUsersParams = {
  limit?: number; // default 10
  skip?: number; // default 0
  q?: string; // if provided, uses /users/search
  select?: string; // comma-separated fields
};

export async function fetchUsers(
  params: ListUsersParams = {}
): Promise<UsersResponse> {
  const { limit = 10, skip = 0, q, select } = params;
  const query = new URLSearchParams();
  query.set("limit", String(limit));
  query.set("skip", String(skip));
  if (select) query.set("select", select);

  if (q && q.trim()) {
    // https://dummyjson.com/users/search?q=John&limit=10&skip=0
    query.set("q", q.trim());
    return getJSON<UsersResponse>(
      `${BASE_URL}/users/search?${query.toString()}`
    );
  }

  // https://dummyjson.com/users?limit=10&skip=0
  return getJSON<UsersResponse>(`${BASE_URL}/users?${query.toString()}`);
}

export async function fetchUser(
  id: number | string,
  select?: string
): Promise<User> {
  const query = new URLSearchParams();
  if (select) query.set("select", select);
  return getJSON<User>(
    `${BASE_URL}/users/${id}${select ? `?${query.toString()}` : ""}`
  );
}

/** --------------------
 * React Query Keys
 * -------------------- */
const qk = {
  users: (params: ListUsersParams = {}) => ["users", { ...params }] as const,
  user: (id: number | string, select?: string) =>
    ["user", { id, select }] as const,
};

/** --------------------
 * useUsers – paginated list (limit/skip) with optional search
 * -------------------- */
export function useUsers(
  params: ListUsersParams = {},
  options?: {
    enabled?: boolean;
    staleTime?: number;
    select?: (data: UsersResponse) => UsersResponse | any;
  }
) {
  return useQuery({
    queryKey: qk.users(params),
    queryFn: () => fetchUsers(params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 30_000, // 30s
    select: options?.select,
    placeholderData: (prev) => prev, // keepPreviousData
  });
}

/**
 * Infinite version (optional):
 */
export function useInfiniteUsers(
  params: Omit<ListUsersParams, "skip"> & { pageSize?: number } = {}
) {
  const { pageSize = params.limit ?? 20, q, select } = params;
  return useInfiniteQuery({
    queryKey: ["users.infinite", { pageSize, q, select }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchUsers({ limit: pageSize, skip: pageParam, q, select }),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: 30_000,
  });
}

/** --------------------
 * useUser – get single user by id
 * -------------------- */
export function useUser(
  id: number | string | undefined,
  select?: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: qk.user(id ?? "unknown", select),
    queryFn: () => {
      if (id === undefined || id === null) throw new Error("Missing user id");
      return fetchUser(id, select);
    },
    enabled: (options?.enabled ?? true) && id !== undefined && id !== null,
    staleTime: options?.staleTime ?? 60_000, // 1m
  });
}

/** --------------------
 * Helpers for prefetching (SSR or router loaders)
 * -------------------- */
export async function prefetchUsers(
  client: QueryClient,
  params: ListUsersParams = {}
) {
  await client.prefetchQuery({
    queryKey: qk.users(params),
    queryFn: () => fetchUsers(params),
  });
}

export async function prefetchUser(
  client: QueryClient,
  id: number | string,
  select?: string
) {
  await client.prefetchQuery({
    queryKey: qk.user(id, select),
    queryFn: () => fetchUser(id, select),
  });
}

/** --------------------
 * Example usage
 * --------------------
 * const { data, isLoading } = useUsers({ limit: 12, skip: 0 })
 * const { data: emily } = useUser(1)
 *
 * // Infinite:
 * const q = useInfiniteUsers({ pageSize: 20 })
 *
 */
