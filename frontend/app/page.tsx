"use client";
import { request, money, errorMessage } from "@/lib/api";
import type { SystemSummary } from "@/lib/types";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/components/current-user";
import { ConfirmAction } from "@/components/confirm-action";
import { PageHeading, PageStatus } from "@/components/page-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { currentUser, isAdmin, users } = useCurrentUser();
  const [summary, setSummary] = useState<SystemSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getSummary() {
    setLoading(true);
    try {
      const summary: SystemSummary = await request(
        `user/system-summary`,
        "GET",
      );
      setSummary(summary);
      setError(null);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void getSummary();
    window.addEventListener("focus", getSummary);
    return () => window.removeEventListener("focus", getSummary);
  }, [users]);
  const statistics = [
    {
      value: summary?.totalUsers ?? 0,
      label: "Total users",
      description: "All user records",
    },
    {
      value: summary?.totalCustomers ?? 0,
      label: "Customers",
      description: "Users with the customer role",
    },
    {
      value: summary?.totalAdmins ?? 0,
      label: "Admins",
      description: "Users with the admin role",
    },
    {
      value: summary?.totalProducts ?? 0,
      label: "Products",
      description: "Products in the catalog",
    },
    {
      value: summary?.totalCategories ?? 0,
      label: "Categories",
      description: "Catalog categories",
    },
    {
      value: summary?.totalMerchants ?? 0,
      label: "Merchants",
      description: "Merchant records",
    },
    {
      value: summary?.totalStock ?? 0,
      label: "Total stock units",
      description: "Units across all stock records",
    },
    {
      value: summary?.outOfStock ?? 0,
      label: "Out-of-stock records",
      description: "Stock records with zero units",
    },
    {
      value: summary?.averagePrice ?? 0,
      label: "Average product price",
      description: "Across all catalog products",
    },
  ];
  return (
    <div className="space-y-8">
      <PageHeading
        title={
          currentUser
            ? `Welcome back, ${currentUser.username}`
            : "Welcome to E-Commerce"
        }
        description={
          currentUser
            ? "A simple overview of your store."
            : "Browse the store or set a User ID in the header to access account actions."
        }
        loading={loading}
        refresh={getSummary}
      />
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">System overview</h2>
        <PageStatus loading={loading} error={error} />
        {!loading && !error && summary && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statistics.map((stat) => (
              <Card key={stat.label}>
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl font-semibold tabular-nums">
                    {stat.label === "Average product price"
                      ? money(stat.value)
                      : stat.value.toLocaleString("en")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {stat.description}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      {isAdmin && currentUser && (
        <Card>
          <CardHeader>
            <CardTitle>Admin actions</CardTitle>
            <CardDescription>
              Repair references left behind after deleting categories, products,
              or merchants.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <ConfirmAction
              onSaved={getSummary}
              label="Fix invalid product categories"
              title="Fix invalid product categories?"
              description="This sets the category ID to null for every product whose category no longer exists."
              destructive={false}
              action={() => setProductsDontHaveCategoryToNull(currentUser.id)}
            />
            <ConfirmAction
              onSaved={getSummary}
              label="Fix invalid stock references"
              title="Fix invalid stock references?"
              description="This sets missing merchant and product references to null across all stock records."
              destructive={false}
              action={() => setInvalidStockReferencesToNull(currentUser.id)}
            />
          </CardContent>
        </Card>
      )}
      <p className="text-xs text-muted-foreground">
        Data is stored in memory and resets when the backend restarts.
      </p>
    </div>
  );
}

async function setProductsDontHaveCategoryToNull(adminId: string) {
  return request(
    `user/products/fix-invalid-categories/${encodeURIComponent(adminId)}`,
    "PUT",
  );
}

async function setInvalidStockReferencesToNull(adminId: string) {
  return request(
    `user/stocks/fix-invalid-references/${encodeURIComponent(adminId)}`,
    "PUT",
  );
}
