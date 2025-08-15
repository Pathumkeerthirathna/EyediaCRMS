import React from "react";
import { CustomerIssue } from "../types";
import { getIssueStatusMeta } from "../Constants/CustomerIssueStatus";

interface IssueCardProps {
  issue: CustomerIssue;
  onClick?: (issue: CustomerIssue) => void;
  onView?: (issue: CustomerIssue) => void; // optional separate view action
}

const formatDate = (iso: string) => {
  if (!iso) return "-";
  try {
    const dt = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return iso;
  }
};

// Map possible status.colorClass values to Tailwind bg colors as a fallback
const badgeBgMap: Record<string, string> = {
  "bg-success": "bg-green-500",
  "bg-warning": "bg-yellow-400",
  "bg-danger": "bg-red-500",
  "bg-info": "bg-blue-500",
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick, onView }) => {
  const status = getIssueStatusMeta(issue.issueStatus);
  const badgeBg =
    badgeBgMap[status.colorClass] || // if it's a bootstrap-like token
    (status.colorClass.startsWith("bg-") ? "" : "") || // fallback if already Tailwind-like (you can expand logic)
    "bg-gray-400";

  return (
    <div
      role="button"
      aria-label={`Issue ${issue.id} - ${issue.customerName}`}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white shadow rounded-2xl border border-gray-200 hover:shadow-md transition cursor-pointer group"
      onClick={() => onClick?.(issue)}
      data-testid={`issue-card-${issue.id}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold truncate">{issue.customerName}</h3>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${badgeBg}`}
          >
            {status.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">{issue.issueDesc}</p>
        <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
          <div>
            <span className="font-semibold">Reported:</span> {formatDate(issue.reportedAt)}
          </div>
          <div>
            <span className="font-semibold">Created By:</span> {issue.createduser}
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onView ? onView(issue) : onClick?.(issue);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"
          aria-label="View issue"
        >
          View
        </button> */}
      </div>
    </div>
  );
};
