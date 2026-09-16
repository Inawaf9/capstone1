"use client";
import { request, errorMessage } from "@/lib/api";
import type { Category } from "@/lib/types";

import { useEffect, useState, useId } from "react";
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getCategories() {
    setLoading(true);
    try {
      const categories: Category[] = await request(`category/get-all`, "GET");
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
    void getCategories();
    window.addEventListener("focus", getCategories);
    return () => window.removeEventListener("focus", getCategories);
  }, []);
  return (
    <div className="space-y-8">
      <PageHeading
        title="Categories"
        description="Organize the catalog and manage category-wide discounts."
        loading={loading}
        refresh={getCategories}
      >
        <CategoryForm onSaved={getCategories} />
      </PageHeading>
      <PageStatus loading={loading} error={error} />
      {!loading && !error && (
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <CategoryForm
                        category={category}
                        onSaved={getCategories}
                      />
                      <DiscountCategory
                        category={category}
                        onSaved={getCategories}
                      />
                      <ConfirmAction
                        onSaved={getCategories}
                        title={`Delete ${category.name}?`}
                        description="Products in this category will retain their category ID until edited or repaired by an admin."
                        action={() => deleteCategory(category.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No categories found.
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

function DiscountCategory({
  category,
  onSaved,
}: {
  category: Category;
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
  async function discountCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await request(
        `product/discount-category/${encodeURIComponent(category.id)}/${Number(percentage)}`,
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
      title={`Discount ${category.name}`}
      trigger="Discount"
      description="Apply this discount to every product in the category."
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={discountCategory}
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

async function deleteCategory(id: string) {
  return request(`category/delete/${encodeURIComponent(id)}`, "DELETE");
}

function CategoryForm({
  category,
  onSaved,
}: {
  category?: Category;
  onSaved: () => Promise<void>;
}) {
  const prefix = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState(category?.id ?? "");
  const [name, setName] = useState(category?.name ?? "");

  function openForm(open: boolean) {
    setOpen(open);
    setError(null);
    if (open) {
      setId(category?.id ?? "");
      setName(category?.name ?? "");
    }
  }
  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const newCategory: Category = { id, name };
      let result;
      if (category) {
        result = await request(
          `category/update/${encodeURIComponent(category.id)}`,
          "PUT",
          newCategory,
        );
      } else {
        result = await request(`category/new`, "POST", newCategory);
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
      title={category ? "Edit category" : "Add category"}
      trigger={category ? "Edit" : "Add category"}
      description={
        "Category names must be unique and at least three characters."
      }
      variant={category ? "outline" : "default"}
      open={open}
      setOpen={openForm}
      busy={busy}
      error={error}
      onSubmit={saveCategory}
    >
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-id`}>ID</Label>
        <Input
          id={`${prefix}-id`}
          type="text"
          value={id}
          onChange={(event) => setId(event.target.value)}
          pattern="c.*"
          readOnly={!!category}
          required
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Must start with &apos;c&apos;. IDs cannot be changed.
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
