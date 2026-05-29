type SupabaseError = {
  code?: string;
  message?: string;
};

/** PostgREST / Postgres errors when tables or columns are not migrated yet. */
export function isMissingSchemaError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as SupabaseError;
  if (e.code === "PGRST205" || e.code === "42703" || e.code === "42P01") return true;
  const msg = e.message?.toLowerCase() ?? "";
  return (
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    msg.includes("could not find the table")
  );
}

export function schemaErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as SupabaseError).message);
  }
  return "Database schema error";
}
