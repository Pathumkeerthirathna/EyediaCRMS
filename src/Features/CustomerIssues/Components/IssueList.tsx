import React, { useState, useMemo, useCallback, useEffect, KeyboardEvent } from "react";
import { CustomerIssue } from "../types";
import { IssueCard } from "./IssueCard";

export interface IssueListProps {
  issues: CustomerIssue[];
  selectedIssueId?: string | number;
  onSelect?: (issue: CustomerIssue) => void;
  loading?: boolean;
  enableSearch?: boolean;
  placeholderText?: string;
}

export const IssueList: React.FC<IssueListProps> = ({
  issues,
  selectedIssueId,
  onSelect,
  loading = false,
  enableSearch = true,
  placeholderText = "No issues to display.",
}) => {
  const [filter, setFilter] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [CurrentPage,setCurrentPage]=useState(1);
  const itemsPerPage = 3;



  // Filtered list
  const filtered = useMemo(() => {
    if (!enableSearch || !filter.trim()) return issues;
    const lower = filter.toLowerCase();
    return issues.filter(
      (i) =>
        (i.customerName && i.customerName.toLowerCase().includes(lower)) ||
        (i.issueDesc && i.issueDesc.toLowerCase().includes(lower)) ||
        (i.createduser && i.createduser.toLowerCase().includes(lower))
    );
  }, [issues, filter, enableSearch]);

  //Paginated issues

    const paginatedIssues = useMemo(()=>{

      const start = (CurrentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filtered.slice(start,end);

  },[filtered,CurrentPage])

  // Reset focus if list changes
  useEffect(() => {
    setFocusedIndex(null);
  }, [filtered]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (filtered.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev === null ? 0 : Math.min(filtered.length - 1, prev + 1);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev === null ? filtered.length - 1 : Math.max(0, prev - 1);
          return next;
        });
      } else if (e.key === "Enter" && focusedIndex !== null) {
        onSelect?.(filtered[focusedIndex]);
      }
    },
    [filtered, focusedIndex, onSelect]
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="inline-flex items-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-gray-400 rounded-full" />
          <span>Loading issues...</span>
        </div>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {filter && enableSearch ? (
          <div>
            No issues match "<span className="font-medium">{filter}</span>"
          </div>
        ) : (
          placeholderText
        )}
      </div>
    );
  }

  return (
  <div
    className="relative h-[75vh] w-full rounded-lg shadow-md overflow-hidden"
    onKeyDown={handleKeyDown}
    tabIndex={0}
    aria-label="Issue list"
  >
    {/* Fixed Header */}
    {enableSearch && (
      <div className="absolute top-0 left-0 right-0 z-10 bg-white px-4 py-2 ">
        <input
          type="text"
          aria-label="Filter issues"
          placeholder="Search issues..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2  rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    )}

    {/* Scrollable Content */}
    <div className="absolute top-16 bottom-12 left-0 right-0 overflow-y-auto px-4 space-y-3 pt-1 thin-scrollbar">
      {paginatedIssues.map((issue, idx) => (
        <div
          key={issue.id}
          className={`outline-none ${
            selectedIssueId === issue.id ? "ring-2 ring-indigo-400 rounded-2xl" : ""
          } ${focusedIndex === idx ? "ring-1 ring-gray-300 rounded-2xl" : ""}`}
        >
          <IssueCard issue={issue} onClick={(i) => onSelect?.(i)} />
        </div>
      ))}
    </div>

    {/* Fixed Footer */}
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-white px-4 py-2 border-t flex justify-center items-center space-x-3">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={CurrentPage === 1}
        className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-2 py-1 text-sm font-medium">
        Page {CurrentPage} of {Math.ceil(filtered.length / itemsPerPage)}
      </span>

      <button
        onClick={() =>
          setCurrentPage((prev) =>
            prev < Math.ceil(filtered.length / itemsPerPage) ? prev + 1 : prev
          )
        }
        disabled={CurrentPage >= Math.ceil(filtered.length / itemsPerPage)}
        className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);

};