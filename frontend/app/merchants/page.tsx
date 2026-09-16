"use client";
import { request, errorMessage } from "@/lib/api";
import type { Merchant, MerchantStock, Product } from "@/lib/types";

import { useEffect, useState, useId } from "react";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ConfirmAction } from "@/components/confirm-action";
import { PageHeading, PageStatus } from "@/components/page-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [merchantStocks, setMerchantStocks] = useState<MerchantStock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getMerchants() {
    setLoading(true);
    try {
      const merchants: Merchant[] = await request(`merchant/get-all`, "GET");
      const merchantStocks: MerchantStock[] = await request(
        `stock/get-all`,
        "GET",
      );
      const products: Product[] = await request(`product/get-all`, "GET");
      setMerchants(merchants);
      setMerchantStocks(merchantStocks);
      setProducts(products);
      setError(null);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void getMerchants();
    window.addEventListener("focus", getMerchants);
    return () => window.removeEventListener("focus", getMerchants);
  }, []);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const selectedMerchant = merchants.find(
    (merchant) => merchant.id === merchantId,
  );
  const stocks = merchantStocks.filter(
    (stock) => !selectedMerchant || stock.merchantId === selectedMerchant.id,
  );
  return (
    <div className="space-y-8">
      <PageHeading
        title="Merchants"
        description="View merchants and inspect their product inventory."
        loading={loading}
        refresh={getMerchants}
      >
        <MerchantForm onSaved={getMerchants} />
      </PageHeading>
      <PageStatus loading={loading} error={error} />
      {!loading && !error && (
        <>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants.map((merchant) => (
                  <TableRow
                    key={merchant.id}
                    data-state={
                      selectedMerchant?.id === merchant.id
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell className="font-medium">
                      {merchant.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {merchant.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          aria-pressed={selectedMerchant?.id === merchant.id}
                          onClick={() => setMerchantId(merchant.id)}
                        >
                          View inventory
                        </Button>
                        <>
                          <MerchantForm
                            merchant={merchant}
                            onSaved={getMerchants}
                          />
                          <ConfirmAction
                            onSaved={getMerchants}
                            title={`Delete ${merchant.name}?`}
                            description="This removes the merchant. Existing stock records remain available in All stock records."
                            action={() => deleteMerchant(merchant.id)}
                          />
                        </>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {merchants.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No merchants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <section className="space-y-4" aria-label="Merchant inventory">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedMerchant
                    ? `${selectedMerchant.name} inventory`
                    : "All stock records"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedMerchant
                    ? selectedMerchant.id
                    : "Includes records with missing merchant or product references."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMerchant && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMerchantId(null)}
                  >
                    All stock records
                  </Button>
                )}
                <StockForm
                  merchantId={selectedMerchant?.id}
                  onSaved={getMerchants}
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="text-muted-foreground">
                        {stock.id}
                      </TableCell>
                      <TableCell>
                        {merchants.find(
                          (merchant) => merchant.id === stock.merchantId,
                        )?.name ?? "Missing merchant"}
                        <div className="text-xs text-muted-foreground">
                          {stock.merchantId ?? "Unassigned"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {products.find(
                          (product) => product.id === stock.productId,
                        )?.name ?? "Missing product"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {stock.productId ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {stock.stock === 0 ? (
                          <Badge variant="secondary">Out of stock</Badge>
                        ) : (
                          stock.stock
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <StockForm stock={stock} onSaved={getMerchants} />
                          <RestockForm stock={stock} onSaved={getMerchants} />
                          <ConfirmAction
                            onSaved={getMerchants}
                            title={`Delete stock record ${stock.id}?`}
                            description="This removes the entire stock record and its available units."
                            action={() => deleteMerchantStock(stock.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {stocks.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No stock records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function RestockForm({
  stock,
  onSaved,
}: {
  stock: MerchantStock;
  onSaved: () => Promise<void>;
}) {
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [merchantId, setMerchantId] = useState(stock.merchantId ?? "");
  const [productId, setProductId] = useState(stock.productId ?? "");
  const [quantity, setQuantity] = useState("1");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setMerchantId(stock.merchantId ?? "");
      setProductId(stock.productId ?? "");
      setQuantity("1");
    }
  }
  async function addStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `stock/update-stock/${encodeURIComponent(merchantId)}/${encodeURIComponent(productId)}/${Number(quantity)}`,
        "PUT",
      );
      toast.success(result.message);
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
      title="Restock product"
      trigger="Restock"
      description={
        "Add units to the first stock record matching these merchant and product IDs."
      }
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={addStock}
    >
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

async function deleteMerchant(id: string) {
  return request(`merchant/delete/${encodeURIComponent(id)}`, "DELETE");
}

async function deleteMerchantStock(id: string) {
  return request(`stock/delete/${encodeURIComponent(id)}`, "DELETE");
}

function MerchantForm({
  merchant,
  onSaved,
}: {
  merchant?: Merchant;
  onSaved: () => Promise<void>;
}) {
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState(merchant?.id ?? "");
  const [name, setName] = useState(merchant?.name ?? "");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setId(merchant?.id ?? "");
      setName(merchant?.name ?? "");
    }
  }
  async function saveMerchant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const newMerchant: Merchant = { id, name };
      let result;
      if (merchant) {
        result = await request(
          `merchant/update/${encodeURIComponent(merchant.id)}`,
          "PUT",
          newMerchant,
        );
      } else {
        result = await request(`merchant/new`, "POST", newMerchant);
      }
      toast.success(result.message);
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
      title={merchant ? "Edit merchant" : "Add merchant"}
      trigger={merchant ? "Edit" : "Add merchant"}
      description={
        "Enter a merchant ID and a unique name of at least three characters."
      }
      variant={merchant ? "outline" : "default"}
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={saveMerchant}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-id`}>ID</Label>
        <Input
          id={`${prefix}-id`}
          type="text"
          value={id}
          onChange={(event) => setId(event.target.value)}
          pattern="m.*"
          readOnly={!!merchant}
          required
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Must start with &apos;m&apos;. IDs cannot be changed.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-name`}>Name</Label>
        <Input
          id={`${prefix}-name`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={3}
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}

function StockForm({
  stock,
  merchantId: selectedMerchantId,
  onSaved,
}: {
  stock?: MerchantStock;
  merchantId?: string;
  onSaved: () => Promise<void>;
}) {
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState(stock?.id ?? "");
  const [merchantId, setMerchantId] = useState(
    stock?.merchantId ?? selectedMerchantId ?? "",
  );
  const [productId, setProductId] = useState(stock?.productId ?? "");
  const [quantity, setQuantity] = useState(String(stock?.stock ?? 10));

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setId(stock?.id ?? "");
      setMerchantId(stock?.merchantId ?? selectedMerchantId ?? "");
      setProductId(stock?.productId ?? "");
      setQuantity(String(stock?.stock ?? 10));
    }
  }
  async function saveMerchantStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const merchantStock: MerchantStock = {
        id,
        merchantId,
        productId,
        stock: Number(quantity),
      };
      let result;
      if (stock) {
        result = await request(
          `stock/update/${encodeURIComponent(stock.id)}`,
          "PUT",
          merchantStock,
        );
      } else {
        result = await request(`stock/new`, "POST", merchantStock);
      }
      toast.success(result.message);
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
      title={stock ? "Edit stock record" : "Add stock record"}
      trigger={stock ? "Edit" : "Add stock record"}
      description={
        "Use existing merchant and product IDs. Saving a stock record requires at least 10 units."
      }
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={saveMerchantStock}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-id`}>ID</Label>
        <Input
          id={`${prefix}-id`}
          type="text"
          value={id}
          onChange={(event) => setId(event.target.value)}
          pattern="s.*"
          readOnly={!!stock}
          required
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Must start with &apos;s&apos;. IDs cannot be changed.
        </p>
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
        <Label htmlFor={`${prefix}-quantity`}>Stock units</Label>
        <Input
          id={`${prefix}-quantity`}
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          min={10}
          max={2147483647}
          step="1"
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}
