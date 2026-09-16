"use client";

import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

// The form's inputs and save function stay in the component using this dialog.
export function FormDialog({
  title,
  description,
  trigger,
  open,
  setOpen,
  busy,
  error,
  onSubmit,
  children,
  submitLabel = "Save",
  variant = "outline",
}: {
  title: string;
  description: string;
  trigger: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  busy: boolean;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  submitLabel?: string;
  variant?: "default" | "outline";
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!busy) setOpen(open);
      }}
    >
      <DialogTrigger render={<Button variant={variant} size="sm" />}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto"
        showCloseButton={!busy}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset disabled={busy} className="space-y-4">
            {children}
          </fieldset>
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="whitespace-pre-wrap">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
