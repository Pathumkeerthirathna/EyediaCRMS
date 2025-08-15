// src/features/CustomerIssues/components/IssueDetailModal.tsx
import React, { useEffect } from "react";
import { CustomerIssue } from "../types";
import { getIssueStatusMeta } from "../Constants/CustomerIssueStatus";

interface IssueDetailModalProps {
  issue: CustomerIssue | null;
  onClose: () => void;
}

const communicationMethodMap: Record<number, string> = {
  1: "Email",
  2: "Phone",
  3: "Chat",
  4: "In Person",
};

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

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  // lock scroll when open
  useEffect(() => {
    if (issue) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [issue, onClose]);

  if (!issue) return null;

  const status = getIssueStatusMeta(issue.issueStatus);

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-start overflow-auto bg-black/40 p-4"
      data-testid={`issue-detail-modal-${issue.id}`}
    >
      <div className="relative w-full max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Issue Details</h2>
            <div className="text-sm text-gray-500">#{issue.id}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-800 rounded-full p-2 transition"
          >
            <span aria-hidden="true" className="text-xl">
              ×
            </span>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Customer Name</div>
              <div className="mt-1 font-semibold">{issue.customerName}</div>
            </div> */}
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Customer Phone</div>
              <div className="mt-1">{issue.customerPhone}</div>
            </div>
            {/* <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Reported At</div>
              <div className="mt-1">{formatDate(issue.reportedAt)}</div>
            </div> */}
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Resolved At</div>
              <div className="mt-1">
                {issue.resolvedAt && !issue.resolvedAt.startsWith("1900")
                  ? formatDate(issue.resolvedAt)
                  : "Unresolved"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Status</div>
              <div className="mt-1 inline-block">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${status.colorClass}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">
                Communication Method
              </div>
              <div className="mt-1">
                {communicationMethodMap[issue.communicationMethod] ?? "Unknown"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">Issue Description</div>
            <div className="mt-1 text-gray-800">{issue.issueDesc}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Created By</div>
              <div className="mt-1">{issue.createduser}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Customer ID</div>
              <div className="mt-1">{issue.customerID}</div>
            </div>
          </div>

          {/* Placeholder for extensions like resolution steps, comments, etc. */}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
