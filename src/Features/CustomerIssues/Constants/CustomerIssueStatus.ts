export enum CustomerIssueStatus {
  PENDING = 0,
  TICKET_CREATED = 1,
  IN_PROGRESS = 2,
  RESOLVED = 3,
  ESCALATED = 4,
  CLOSED = 5,
}

export const issueStatusMeta: Record<
  CustomerIssueStatus,
  { label: string; colorClass: string }
> = {
  [CustomerIssueStatus.PENDING]: {
    label: "Pending",
    colorClass: "bg-blue-100 text-blue-800",
  },
  [CustomerIssueStatus.TICKET_CREATED]: {
    label: "Ticket Created",
    colorClass: "bg-indigo-100 text-indigo-800",
  },
  [CustomerIssueStatus.IN_PROGRESS]: {
    label: "In Progress",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  [CustomerIssueStatus.RESOLVED]: {
    label: "Resolved",
    colorClass: "bg-green-100 text-green-800",
  },
  [CustomerIssueStatus.ESCALATED]: {
    label: "Escalated",
    colorClass: "bg-red-100 text-red-800",
  },
  [CustomerIssueStatus.CLOSED]: {
    label: "Closed",
    colorClass: "bg-gray-100 text-gray-800",
  },
};

export function getIssueStatusMeta(status: number) {
  return (
    issueStatusMeta[status as CustomerIssueStatus] ?? {
      label: "Unknown",
      colorClass: "bg-gray-100 text-gray-800",
    }
  );
}