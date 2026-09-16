"use client";
import { money, errorMessage } from "@/lib/api";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Store, UserRound } from "lucide-react";

import { useCurrentUser } from "./current-user";
import {
  ChargeBalance,
  TransferBalance,
  PromoteCustomer,
} from "./account-forms";
import { UserRecords } from "./user-records";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const links = [
  ["/", "Home"],
  ["/products", "Products"],
  ["/categories", "Categories"],
  ["/merchants", "Merchants"],
];

export function Header() {
  const pathname = usePathname();
  const {
    currentUser,
    isAdmin,
    selectUser,
    clearUser,
    usersLoading,
    userError,
    selectionError,
    refreshUser,
  } = useCurrentUser();
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function select(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await selectUser(id.trim());
      setId("");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <Store className="size-5" />
            E-Commerce
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <>
                <div className="text-sm">
                  <span className="font-medium">{currentUser.username}</span>{" "}
                  <Badge variant="secondary">{currentUser.role}</Badge>
                  <p className="text-muted-foreground">
                    {currentUser.id} · {money(currentUser.balance)}
                  </p>
                </div>
                <Sheet>
                  <SheetTrigger render={<Button size="sm" variant="outline" />}>
                    <UserRound className="size-4" />
                    Account
                  </SheetTrigger>
                  <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
                    <SheetHeader>
                      <SheetTitle>Current user</SheetTitle>
                      <SheetDescription>
                        This ID selector is for the bootcamp demo and provides
                        no authentication.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 px-6 pb-6">
                      <div className="space-y-2">
                        <p className="font-medium wrap-break-word">
                          {currentUser.username}{" "}
                          <Badge variant="secondary">{currentUser.role}</Badge>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentUser.id}
                        </p>
                        <p className="break-all text-sm text-muted-foreground">
                          {currentUser.email}
                        </p>
                        <p className="text-xl font-semibold">
                          {money(currentUser.balance)}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        <ChargeBalance userId={currentUser.id} />
                        <TransferBalance userId={currentUser.id} />
                      </div>
                      {isAdmin && (
                        <>
                          <Separator />
                          <h3 className="font-medium">Admin actions</h3>
                          <PromoteCustomer userId={currentUser.id} />
                        </>
                      )}
                      <Separator />
                      <UserRecords />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={usersLoading}
                          onClick={refreshUser}
                        >
                          Refresh user
                        </Button>
                        <Button size="sm" variant="outline" onClick={clearUser}>
                          Change / clear user
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <form onSubmit={select} className="flex items-center gap-2">
                  <Label htmlFor="current-user-id" className="sr-only">
                    Current User ID
                  </Label>
                  <Input
                    id="current-user-id"
                    className="w-32 sm:w-40"
                    placeholder="User ID, e.g. u001"
                    required
                    value={id}
                    onChange={(event) => setId(event.target.value)}
                  />
                  <Button type="submit" size="sm" disabled={busy}>
                    {busy ? "Finding…" : "Set user"}
                  </Button>
                </form>
                <UserRecords />
              </>
            )}
          </div>
        </div>
        <nav aria-label="Main navigation" className="mt-4 flex flex-wrap gap-1">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${pathname === href ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {(error || userError || selectionError) && (
          <Alert variant="destructive" className="mt-3">
            <AlertDescription>
              {error || userError || selectionError}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setError(null);
                  void refreshUser();
                }}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </header>
  );
}
