"use client";
import { errorMessage } from "@/lib/api";

import { useState } from "react";
import { toast } from "sonner";

import type { ApiResponse } from "@/lib/types";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export function ConfirmAction({
  label = "Delete",
  title,
  description,
  action,
  destructive = true,
  onSaved,
}: {
  label?: string;
  title: string;
  description: string;
  action: () => Promise<ApiResponse>;
  destructive?: boolean;
  onSaved?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      toast.success(result.message);
      await onSaved?.();
      setOpen(false);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) {
          setOpen(next);
          setError(null);
        }
      }}
    >
      <AlertDialogTrigger
        render={
          <Button size="sm" variant={destructive ? "destructive" : "outline"} />
        }
      >
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            variant={destructive ? "destructive" : "default"}
            onClick={confirm}
          >
            {busy ? "Working…" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
