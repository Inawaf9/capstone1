"use client";
import { request, errorMessage } from "@/lib/api";

import { createContext, useContext, useEffect, useState } from "react";

import type { User } from "@/lib/types";

interface CurrentUserContext {
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;
  userError: string | null;
  selectionError: string | null;
  usersLoading: boolean;
  selectUser: (id: string) => Promise<void>;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContext | null>(null);
const storageKey = "ecommerce-current-user-id";

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);

  async function refreshUser() {
    setUsersLoading(true);
    try {
      const users: User[] = await request(`user/get-all`, "GET");
      setUsers(users);
      setUserError(null);
    } catch (error) {
      setUsers([]);
      setUserError(errorMessage(error));
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    try {
      // Read the saved ID after the page opens in the browser.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(localStorage.getItem(storageKey));
    } catch {
      // User selection still works if browser storage is disabled.
    }
    void refreshUser();
    window.addEventListener("focus", refreshUser);
    return () => window.removeEventListener("focus", refreshUser);
  }, []);

  async function selectUser(id: string) {
    const users: User[] = await request(`user/get-all`, "GET");
    setUsers(users);
    setUserError(null);
    const foundUser = users.find((user) => user.id === id);
    if (!foundUser) throw new Error("No user found with this ID.");
    setUserId(id);
    try {
      localStorage.setItem(storageKey, id);
    } catch {
      // User selection still works without localStorage.
    }
  }

  function clearUser() {
    setUserId(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Browser storage may be disabled.
    }
  }

  const currentUser = users.find((user) => user.id === userId) ?? null;
  const selectionError =
    userId && !usersLoading && !userError && !currentUser
      ? "The selected user no longer exists. Set another User ID."
      : null;

  return (
    <CurrentUserContext.Provider
      value={{
        users,
        currentUser,
        isAdmin: currentUser?.role === "admin",
        userError,
        selectionError,
        usersLoading,
        selectUser,
        clearUser,
        refreshUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext);
  if (!currentUser) throw new Error("CurrentUserProvider is required.");
  return currentUser;
}
