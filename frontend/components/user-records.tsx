"use client";
import { useId, useState } from "react";
import { toast } from "sonner";
import type { User } from "@/lib/types";
import { FormDialog } from "./form-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { request, money, errorMessage } from "@/lib/api";

import { useCurrentUser } from "./current-user";
import { ConfirmAction } from "./confirm-action";
import { PageStatus } from "./page-status";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function UserRecords() {
  const { users, usersLoading, userError, refreshUser } = useCurrentUser();
  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        User records
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>User records</DialogTitle>
          <DialogDescription>
            In-memory users for this bootcamp. Enter an ID in the header to
            select a current user.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <UserForm />
          <Button
            variant="outline"
            size="sm"
            onClick={refreshUser}
            disabled={usersLoading}
          >
            Refresh
          </Button>
        </div>
        <PageStatus loading={usersLoading} error={userError} />
        {!usersLoading && !userError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username / ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.id}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{money(user.balance)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <>
                        <UserForm user={user} />
                        <ConfirmAction
                          onSaved={refreshUser}
                          title={`Delete ${user.username}?`}
                          description="This removes the user record from the backend."
                          action={() => deleteUser(user.id)}
                        />
                      </>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No users found. Add a user to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

async function deleteUser(id: string) {
  return request(`user/delete/${encodeURIComponent(id)}`, "DELETE");
}

function UserForm({ user }: { user?: User }) {
  const { refreshUser } = useCurrentUser();
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState(user?.id ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState(user?.password ?? "");
  const [role, setRole] = useState(user?.role.toLowerCase() ?? "customer");
  const [balance, setBalance] = useState(String(user?.balance ?? ""));

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setId(user?.id ?? "");
      setUsername(user?.username ?? "");
      setEmail(user?.email ?? "");
      setPassword(user?.password ?? "");
      setRole(user?.role.toLowerCase() ?? "customer");
      setBalance(String(user?.balance ?? ""));
    }
  }
  async function saveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const newUser: User = {
        id,
        username,
        email,
        password,
        role,
        balance: Number(balance),
      };
      let result;
      if (user) {
        result = await request(
          `user/update/${encodeURIComponent(user.id)}`,
          "PUT",
          newUser,
        );
      } else {
        result = await request(`user/new`, "POST", newUser);
      }
      toast.success(result.message);
      await refreshUser();
      setOpen(false);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FormDialog
      title={user ? "Edit user" : "Add user"}
      trigger={user ? "Edit" : "Add user"}
      description={
        "Create or update a backend user record. This does not sign you in."
      }
      variant="outline"
      submitLabel="Save"
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={saveUser}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-id`}>ID</Label>
        <Input
          id={`${prefix}-id`}
          type="text"
          value={id}
          onChange={(event) => setId(event.target.value)}
          pattern="u.*"
          readOnly={!!user}
          required
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Must start with &apos;u&apos;. IDs cannot be changed.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-username`}>Username</Label>
        <Input
          id={`${prefix}-username`}
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          minLength={5}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-email`}>Email</Label>
        <Input
          id={`${prefix}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-password`}>Password</Label>
        <Input
          id={`${prefix}-password`}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">
          At least 6 characters with uppercase, lowercase, a number, and a
          special character.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-role`}>Role</Label>
        <Select
          value={role}
          onValueChange={(value) => {
            if (value) setRole(value);
          }}
        >
          <SelectTrigger id={`${prefix}-role`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">customer</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-balance`}>Balance (⃁)</Label>
        <Input
          id={`${prefix}-balance`}
          type="number"
          value={balance}
          onChange={(event) => setBalance(event.target.value)}
          min={0.01}
          step="any"
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}
