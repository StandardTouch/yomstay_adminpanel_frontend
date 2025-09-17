import React, { useState } from "react";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

function AlertBox({ onDelete, Check, hotelName }) {
  const [rejectReason, setRejectReason] = useState("");
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          className={`cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded-2xl
                    ${
                      Check === "Hotel" &&
                      " py-2 px-2.5 rounded-md absolute bottom-2 right-2"
                    }
                    ${Check === "Reject" && "py-1.5 px-3 rounded-md"}
                    ${
                      Check === "Faq" &&
                      " py-1 px-2.5 text-sm rounded-md absolute top-2 right-2"
                    }
                    ${Check === "Amenity" && "p-0.5 rounded-2xl"}
                    ${Check === "Image" && "p-1 rounded-2xl"}`}
        >
          {(Check === "Amenity" || Check === "Image") && <X size={16} />}
          {(Check === "Hotel" || Check === "Faq") && `Remove ${Check}`}
          {Check === "Reject" && "Reject"}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <div className="text-red-500 font-medium">{hotelName}</div>
          {Check === "Reject" ? (
            <AlertDialogDescription className="flex flex-col gap-2">
              Are you sure you want to reject or block this request?
              <p className="text-red-500 mb-[-5px] italic ">required *</p>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection or blocking"
                required
              />
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {Check}.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRejectReason("")} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>

          {Check === "Reject" ? (
            <div className="flex gap-2">
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                onClick={onDelete}
                disabled={!rejectReason}
              >
                Reject
              </AlertDialogAction>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                onClick={onDelete}
                disabled={!rejectReason}
              >
                Block
              </AlertDialogAction>
            </div>
          ) : (
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-700 text-white cursor-pointer"
              onClick={onDelete}
            >
              Continue
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertBox;
