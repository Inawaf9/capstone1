import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

export function PageHeading({
  title,
  description,
  loading,
  refresh,
  children,
}: {
  title: string;
  description: string;
  loading: boolean;
  refresh: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={refresh}
        >
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
export function PageStatus({
  loading,
  error,
}: {
  loading: boolean;
  error: string | null;
}) {
  if (loading)
    return (
      <div role="status" aria-label="Loading data" className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <span className="sr-only">Loading data…</span>
      </div>
    );
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load data</AlertTitle>
        <AlertDescription className="whitespace-pre-wrap">
          {error}
        </AlertDescription>
      </Alert>
    );
  return null;
}
