"use client";
import { request, money, errorMessage } from "@/lib/api";
import type { Product, Category } from "@/lib/types";

import { useEffect, useState, useId } from "react";
import { BuyDialog, GiftDialog } from "@/components/purchase-dialogs";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ConfirmAction } from "@/components/confirm-action";
import { PageHeading, PageStatus } from "@/components/page-status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getProducts() {
    setLoading(true);
    try {
      const products: Product[] = await request(`product/get-all`, "GET");
      const categories: Category[] = await request(`category/get-all`, "GET");
      setProducts(products);
      setCategories(categories);
      setError(null);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void getProducts();
    window.addEventListener("focus", getProducts);
    return () => window.removeEventListener("focus", getProducts);
  }, []);
  return (
    <div className="space-y-8">
      <PageHeading
        title="Products"
        description="Browse the catalog, purchase products, or send a gift."
        loading={loading}
        refresh={getProducts}
      >
        <ProductForm onSaved={getProducts} />
        <BuyDialog onSaved={getProducts} />
        <GiftDialog onSaved={getProducts} />
      </PageHeading>
      <PageStatus loading={loading} error={error} />
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.id}
                  </TableCell>
                  <TableCell>
                    {categories.find(
                      (category) => category.id === product.categoryId,
                    )?.name ?? "No category"}
                    <div className="text-xs text-muted-foreground">
                      {product.categoryId ?? "Unassigned"}
                    </div>
                  </TableCell>
                  <TableCell>{money(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <BuyDialog productId={product.id} onSaved={getProducts} />
                      <>
                        <ProductForm product={product} onSaved={getProducts} />
                        <DiscountProduct
                          product={product}
                          onSaved={getProducts}
                        />
                        <ConfirmAction
                          onSaved={getProducts}
                          title={`Delete ${product.name}?`}
                          description="The product will be removed. Existing stock records are not deleted automatically."
                          action={() => deleteProduct(product.id)}
                        />
                      </>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function DiscountProduct({
  product,
  onSaved,
}: {
  product: Product;
  onSaved: () => Promise<void>;
}) {
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [percentage, setPercentage] = useState("");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setPercentage("");
    }
  }
  async function discountProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `product/discount-product/${encodeURIComponent(product.id)}/${Number(percentage)}`,
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
      title={`Discount ${product.name}`}
      trigger="Discount"
      description="Apply a percentage discount to this product."
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={discountProduct}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-percentage`}>Percentage</Label>
        <Input
          id={`${prefix}-percentage`}
          type="number"
          value={percentage}
          onChange={(event) => setPercentage(event.target.value)}
          min={0.01}
          max={100}
          step="any"
          required
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Applied to the current price.
        </p>
      </div>
    </FormDialog>
  );
}

async function deleteProduct(id: string) {
  return request(`product/delete/${encodeURIComponent(id)}`, "DELETE");
}

function ProductForm({
  product,
  onSaved,
}: {
  product?: Product;
  onSaved: () => Promise<void>;
}) {
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState(product?.id ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setId(product?.id ?? "");
      setName(product?.name ?? "");
      setPrice(String(product?.price ?? ""));
      setCategoryId(product?.categoryId ?? "");
    }
  }
  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const newProduct: Product = {
        id,
        name,
        price: Number(price),
        categoryId,
      };
      let result;
      if (product) {
        result = await request(
          `product/update/${encodeURIComponent(product.id)}`,
          "PUT",
          newProduct,
        );
      } else {
        result = await request(`product/new`, "POST", newProduct);
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
      title={product ? "Edit product" : "Add product"}
      trigger={product ? "Edit" : "Add product"}
      description="Enter the product details and an existing category ID."
      variant={product ? "outline" : "default"}
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={saveProduct}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-id`}>ID</Label>
        <Input
          id={`${prefix}-id`}
          type="text"
          value={id}
          onChange={(event) => setId(event.target.value)}
          pattern="p.*"
          readOnly={!!product}
          required
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Must start with &apos;p&apos;. IDs cannot be changed.
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
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-price`}>Price (⃁)</Label>
        <Input
          id={`${prefix}-price`}
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          min={0.01}
          step="any"
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-categoryId`}>Category ID</Label>
        <Input
          id={`${prefix}-categoryId`}
          type="text"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
          autoComplete="off"
        />
      </div>
    </FormDialog>
  );
}
