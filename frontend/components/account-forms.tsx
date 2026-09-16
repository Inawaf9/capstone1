"use client";
import { request, errorMessage } from "@/lib/api";
import { useId, useState } from "react";
import { toast } from "sonner";

import { FormDialog } from "./form-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { useCurrentUser } from "./current-user";
export function ChargeBalance({ userId }: { userId: string }) {
  const { refreshUser } = useCurrentUser();
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setAmount("");
    }
  }
  async function chargeBalance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `user/charge/${encodeURIComponent(userId)}/${Number(amount)}`,
        "PUT",
      );
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
      title="Charge balance"
      trigger="Charge balance"
      description="Add funds to the current user."
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={chargeBalance}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-amount`}>Amount (⃁)</Label>
        <Input
          id={`${prefix}-amount`}
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          min={0.01}
          step="any"
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}

export function TransferBalance({ userId }: { userId: string }) {
  const { refreshUser } = useCurrentUser();
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setReceiverId("");
      setAmount("");
    }
  }
  async function transferBalance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `user/transfer/${encodeURIComponent(userId)}/${encodeURIComponent(receiverId)}/${Number(amount)}`,
        "POST",
      );
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
      title="Transfer balance"
      trigger="Transfer balance"
      description="Send funds from the current user."
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={transferBalance}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-receiverId`}>Receiver ID</Label>
        <Input
          id={`${prefix}-receiverId`}
          type="text"
          value={receiverId}
          onChange={(event) => setReceiverId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-amount`}>Amount (⃁)</Label>
        <Input
          id={`${prefix}-amount`}
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          min={0.01}
          step="any"
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}

export function PromoteCustomer({ userId }: { userId: string }) {
  const { refreshUser } = useCurrentUser();
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setCustomerId("");
    }
  }
  async function changeCustomerRoleToAdmin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `user/change-role-to-admin/${encodeURIComponent(userId)}/${encodeURIComponent(customerId)}`,
        "PUT",
      );
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
      title="Promote customer"
      trigger="Promote customer"
      description="Change an existing customer's role to admin."
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={changeCustomerRoleToAdmin}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-customerId`}>Customer ID</Label>
        <Input
          id={`${prefix}-customerId`}
          type="text"
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}
