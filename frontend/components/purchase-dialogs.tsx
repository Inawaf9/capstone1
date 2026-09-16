"use client";
import { request, errorMessage } from "@/lib/api";
import { useId, useState } from "react";
import { toast } from "sonner";

import { FormDialog } from "./form-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { useCurrentUser } from "./current-user";
export function BuyDialog({
  productId: selectedProductId,
  onSaved,
}: {
  productId?: string;
  onSaved: () => Promise<void>;
}) {
  const { currentUser, refreshUser } = useCurrentUser();
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState(currentUser?.id ?? "");
  const [productId, setProductId] = useState(selectedProductId ?? "");
  const [merchantId, setMerchantId] = useState("");
  const [quantity, setQuantity] = useState("1");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setUserId(currentUser?.id ?? "");
      setProductId(selectedProductId ?? "");
      setMerchantId("");
      setQuantity("1");
    }
  }
  async function buyProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      let result;
      if (Number(quantity) === 1) {
        result = await request(
          `user/buy-product/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}/${encodeURIComponent(merchantId)}`,
          "POST",
        );
      } else {
        result = await request(
          `user/buy-product/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}/${encodeURIComponent(merchantId)}/${Number(quantity)}`,
          "POST",
        );
      }
      toast.success(result.message);
      await refreshUser();
      await onSaved();
      setOpen(false);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FormDialog
      title="Buy product"
      trigger={selectedProductId ? "Buy" : "Buy product"}
      description={
        "Enter the IDs and quantity to purchase from a merchant. Quantity 1 buys one unit."
      }
      submitLabel="Buy"
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={buyProduct}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-userId`}>User ID</Label>
        <Input
          id={`${prefix}-userId`}
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-productId`}>Product ID</Label>
        <Input
          id={`${prefix}-productId`}
          type="text"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-merchantId`}>Merchant ID</Label>
        <Input
          id={`${prefix}-merchantId`}
          type="text"
          value={merchantId}
          onChange={(event) => setMerchantId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-quantity`}>Quantity</Label>
        <Input
          id={`${prefix}-quantity`}
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          min={1}
          max={2147483647}
          step="1"
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}

export function GiftDialog({ onSaved }: { onSaved: () => Promise<void> }) {
  const { currentUser, refreshUser } = useCurrentUser();
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [senderId, setSenderId] = useState(currentUser?.id ?? "");
  const [receiverId, setReceiverId] = useState("");
  const [productId, setProductId] = useState("");
  const [merchantId, setMerchantId] = useState("");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setSenderId(currentUser?.id ?? "");
      setReceiverId("");
      setProductId("");
      setMerchantId("");
    }
  }
  async function buyProductAsGift(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `user/buy-gift/${encodeURIComponent(senderId)}/${encodeURIComponent(receiverId)}/${encodeURIComponent(productId)}/${encodeURIComponent(merchantId)}`,
        "POST",
      );
      toast.success(result.message);
      await refreshUser();
      await onSaved();
      setOpen(false);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FormDialog
      title="Buy product as gift"
      trigger="Buy gift"
      description={
        "Purchase one unit for another user. The sender pays for the gift."
      }
      submitLabel="Buy gift"
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={buyProductAsGift}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-senderId`}>Sender ID</Label>
        <Input
          id={`${prefix}-senderId`}
          type="text"
          value={senderId}
          onChange={(event) => setSenderId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
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
        <Label htmlFor={`${prefix}-productId`}>Product ID</Label>
        <Input
          id={`${prefix}-productId`}
          type="text"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-merchantId`}>Merchant ID</Label>
        <Input
          id={`${prefix}-merchantId`}
          type="text"
          value={merchantId}
          onChange={(event) => setMerchantId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}
