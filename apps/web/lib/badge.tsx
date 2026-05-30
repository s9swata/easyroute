export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: "badge-primary", en_route: "badge-warning", at_pickup: "badge-warning",
    ongoing: "badge-primary", completed: "badge-success", cancelled: "badge-danger",
    requested: "badge-primary", allocated: "badge-success",
    open: "badge-warning", in_review: "badge-primary", resolved: "badge-success",
  };
  const cls = map[status] || "badge-muted";
  return <span className={`badge ${cls}`}>{status}</span>;
}
