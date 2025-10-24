// src/components/TransactionTable.tsx
import React from "react";

type Row = { label: string; value: React.ReactNode };

export default function TransactionTable({
  compact = false,
  rows = [],
}: {
  compact?: boolean;
  rows?: Row[];
}) {
  return (
    <table className={`w-full ${compact ? "text-xs" : "text-sm"}`}>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b last:border-b-0">
            <td className="py-2 pr-3 text-gray-500 whitespace-nowrap">
              {r.label}
            </td>
            <td className="py-2 font-medium">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
