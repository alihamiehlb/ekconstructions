type Props = {
  missing?: ("enquiryCrm" | "adminUsers" | "business")[];
};

export function AdminMigrationBanner({ missing = ["business", "adminUsers", "enquiryCrm"] }: Props) {
  const labels: Record<string, string> = {
    enquiryCrm: "Enquiry status fields",
    adminUsers: "Admin accounts table",
    business: "Business orders & invoices",
  };

  return (
    <div className="rounded-2xl border border-ek-teal/30 bg-ek-teal/5 p-5 text-sm text-ek-navy">
      <p className="font-bold">Database migration required</p>
      <p className="mt-2 leading-relaxed">
        New admin features need tables in Supabase that are not created yet. Open{" "}
        <strong>Supabase → SQL Editor</strong> and run the migration file:
      </p>
      <code className="mt-3 block rounded-lg bg-white px-3 py-2 text-xs">
        supabase/migrations/20240529180000_admin_business_enquiries.sql
      </code>
      <p className="mt-3 text-xs leading-relaxed">
        Missing: {missing.map((m) => labels[m] ?? m).join(" · ")}. After running SQL, refresh
        this page.
      </p>
    </div>
  );
}
