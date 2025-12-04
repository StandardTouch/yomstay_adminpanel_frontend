import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function singleSupportRequest({ request }) {
  const singleRequestData = request;

  //   Class for Colors
  const detaileTitleClass =
    "font-medium text-gray-600 dark:text-gray-400 text-sm ";
  const detailValueClass = "text-lg font-semibold";

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "low") return "default";
    if (statusLower === "medium") return "secondary";
    if (statusLower === "high" || statusLower === "canceled")
      return "destructive";
    return "outline";
  };

  function formatDate(iso) {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch (e) {
      return iso;
    }
  }

  return (
    <div className="px-4 grid grid-cols-2 gap-4 *:border *:flex *:flex-col *:space-y-1 *:p-4 *:rounded-lg ">
      <div>
        <div className={detaileTitleClass}>ID:</div>
        <div className={detailValueClass}>{singleRequestData.id}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Name:</div>
        <div className={detailValueClass}>{singleRequestData.name}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Email:</div>
        <div className={detailValueClass}>{singleRequestData.email}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Phone:</div>
        <div className={detailValueClass}>{singleRequestData.phone}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Type:</div>
        <div className={detailValueClass}>{singleRequestData.type}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Category:</div>
        <div className={detailValueClass}>{singleRequestData.category}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Subject:</div>
        <div className={detailValueClass}>{singleRequestData.subject}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Message:</div>
        <div className={detailValueClass}>{singleRequestData.message}</div>
      </div>
      <div>
        <div className={detaileTitleClass}>Priority:</div>
        <div className={detailValueClass}>
          <Badge variant={getStatusVariant(singleRequestData.priority)}>
            {singleRequestData.priority}
          </Badge>
        </div>
      </div>
      <div>
        <div className={detaileTitleClass}>Status:</div>
        <div className={detailValueClass}>
          <Badge>{singleRequestData.status}</Badge>
        </div>
      </div>
      <div>
        <p className={detaileTitleClass}>Linked Booking / Hotel</p>
        <div className="flex items-center space-x-3">
          <p className={detailValueClass}>
            {singleRequestData.bookingId ?? "—"}
          </p>
          <p className={detailValueClass}>{singleRequestData.hotelId ?? "—"}</p>
        </div>
      </div>
      <div className="p-4 row-span-2 ">
        <p className={detaileTitleClass}>Created</p>
        <p className={detailValueClass}>
          {formatDate(singleRequestData.createdAt)}
        </p>

        <div className="mt-4">
          <p className={detaileTitleClass}>Last Updated</p>
          <p className={detailValueClass}>
            {formatDate(singleRequestData.updatedAt)}
          </p>
        </div>

        <div className="mt-4">
          <p className={detaileTitleClass}>Resolved / Closed</p>
          <p className={detailValueClass}>
            {singleRequestData.resolvedAt
              ? formatDate(singleRequestData.resolvedAt)
              : singleRequestData.closedAt
              ? formatDate(singleRequestData.closedAt)
              : "—"}
          </p>
        </div>
      </div>
      <div>
        <div className={detaileTitleClass}>Admin Notes:</div>
        <div className={detailValueClass}>
          {singleRequestData.adminNotes || "N/A"}
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex items-center justify-between">
          <p className={detaileTitleClass}>Attachments</p>
          <p className="text-xs text-slate-400">
            {singleRequestData.attachments?.length ?? 0}
          </p>
        </div>
        <div className="mt-3 space-y-2 ">
          {singleRequestData.attachments &&
          singleRequestData.attachments.length > 0 ? (
            singleRequestData.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url ?? "#"}
                className="block text-sm truncate hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {att.name ?? `Attachment ${idx + 1}`}
              </a>
            ))
          ) : (
            <div className="text-sm text-slate-500">No attachments</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default singleSupportRequest;
