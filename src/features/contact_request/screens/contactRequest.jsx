import React, { use, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function contactRequest() {
  const contactRequestlist = [
    {
      id: "9a1b2c3d-1111-4444-8888-aaaabbbbcccc",
      email: "john.doe@example.com",
      subject: "Issue with my booking",
      comment:
        "I need help with my recent reservation. The date seems incorrect.",
      reservationNumber: "RSV12345",
      bookingId: "bkg-001",
      status: "open",
      attachments: [
        {
          id: "a1b2c3d4-1111-2222-3333-444455556666",
          contactRequestId: "9a1b2c3d-1111-4444-8888-aaaabbbbcccc",
          url: "https://example-s3.com/uploads/booking_issue.png",
          s3Key: "uploads/booking_issue.png",
          fileName: "booking_issue.png",
          mimeType: "image/png",
          size: 345678,
          createdAt: "2025-10-10T09:30:00.000Z",
        },
      ],
      createdAt: "2025-10-10T09:25:00.000Z",
      updatedAt: "2025-10-10T09:25:00.000Z",
    },
    {
      id: "8f7e6d5c-2222-5555-9999-ddddeeeeffff",
      email: "sarah.wilson@example.com",
      subject: "Payment confirmation issue",
      comment: "I completed payment but it still shows pending. Please verify.",
      reservationNumber: "RSV67890",
      bookingId: "bkg-002",
      status: "in_progress",
      attachments: [
        {
          id: "b2c3d4e5-7777-8888-9999-000011112222",
          contactRequestId: "8f7e6d5c-2222-5555-9999-ddddeeeeffff",
          url: "https://example-s3.com/uploads/payment_receipt.pdf",
          s3Key: "uploads/payment_receipt.pdf",
          fileName: "payment_receipt.pdf",
          mimeType: "application/pdf",
          size: 128900,
          createdAt: "2025-10-11T12:00:00.000Z",
        },
      ],
      createdAt: "2025-10-11T11:45:00.000Z",
      updatedAt: "2025-10-12T08:00:00.000Z",
    },
    {
      id: "3a2b1c9d-3333-6666-aaaa-bbbbccccdddd",
      email: "michael.smith@example.com",
      subject: "Request for refund",
      comment: "My booking was canceled but refund not received yet.",
      reservationNumber: "RSV99887",
      bookingId: "bkg-003",
      status: "resolved",
      attachments: [],
      createdAt: "2025-10-09T10:00:00.000Z",
      updatedAt: "2025-10-13T15:30:00.000Z",
    },
    {
      id: "7c8d9e0f-4444-7777-bbbb-ccccddddeeee",
      email: "emma.brown@example.com",
      subject: "General inquiry",
      comment: "Can I change my check-in time for next week’s stay?",
      reservationNumber: null,
      bookingId: null,
      status: "closed",
      attachments: [],
      createdAt: "2025-10-08T14:20:00.000Z",
      updatedAt: "2025-10-09T09:00:00.000Z",
    },
  ];
  const [contactRequests, setContactRequests] = useState(contactRequestlist);
  const [ViewContactRequest, setViewContactRequest] = useState({
    id: null,
    email: null,
    subject: null,
    comment: null,
    reservationNumber: null,
    bookingId: null,
    status: null,
    attachments: [],
    createdAt: null,
    updatedAt: null,
  });
  const [addOpen, setAddOpen] = useState(false);
  const [updateReason, setUpdateReason] = useState("");

  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const tableHead = [
    "Email",
    "Subject",
    "Reservation",
    "Status",
    "Created At",
    "Actions",
  ];

  const statusOptions = ["open", "in_progress", "resolved", "closed"];

  const statusColorMapping = {
    open: "bg-red-100 text-red-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const updateContactRequest = () => {
    setContactRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === ViewContactRequest.id ? ViewContactRequest : request
      )
    );
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Request</h1>
      </div>
      <div className="mt-8 flex flex-col relative">
        <div className=" mt-4 border w-full md:absolute p-2 rounded ">
          <Table className=" w-full ">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                {tableHead.map((head) => (
                  <TableHead key={head}>{head}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactRequests.map((contactRequest) => (
                <TableRow>
                  <TableCell className="font-medium">
                    {contactRequest.email}
                  </TableCell>
                  <TableCell>
                    {contactRequest.subject.slice(0, 20)}
                    {contactRequest.subject.length > 20 ? "..." : ""}
                  </TableCell>
                  <TableCell>{contactRequest.reservationNumber}</TableCell>
                  <TableCell>
                    <p
                      className={`${
                        statusColorMapping[contactRequest.status]
                      } p-1 rounded flex justify-center capitalize`}
                    >
                      {contactRequest.status}
                    </p>
                  </TableCell>
                  <TableCell>
                    {new Date(contactRequest.createdAt).toLocaleDateString(
                      "en-US",
                      dateOptions
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        setAddOpen(true);
                        setViewContactRequest(contactRequest);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Request</DialogTitle>
              <div>
                Detailed information about the contact request.
                {ViewContactRequest.id && (
                  <div className="mt-4 flex flex-col gap-2">
                    <p>
                      <strong>Email:</strong> {ViewContactRequest.email}
                    </p>
                    <p>
                      <strong>Subject:</strong> {ViewContactRequest.subject}
                    </p>
                    <div>
                      <strong>Comment:</strong>
                      <div className="p-2 border rounded">
                        {ViewContactRequest.comment}
                      </div>
                    </div>
                    <div>
                      <strong>Attachments:</strong>
                      <div className="flex flex-col gap-1 mt-1">
                        {ViewContactRequest.attachments.length > 0 ? (
                          ViewContactRequest.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {attachment.fileName}
                            </a>
                          ))
                        ) : (
                          <p>No attachments available.</p>
                        )}
                      </div>
                    </div>
                    <div className=" grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <strong>Reservation Number:</strong>{" "}
                        {ViewContactRequest.reservationNumber}
                      </div>
                      <div className="flex flex-col gap-1">
                        <strong>Booking ID:</strong>{" "}
                        {ViewContactRequest.bookingId}
                      </div>
                    </div>
                    <div className={` flex items-center gap-2 `}>
                      <strong>Status:</strong>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className={`${
                            statusColorMapping[ViewContactRequest.status]
                          } capitalize border flex items-center gap-1 p-1 rounded cursor-pointer`}
                        >
                          {ViewContactRequest.status} <ChevronDown size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusOptions.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => {
                                setViewContactRequest({
                                  ...ViewContactRequest,
                                  status: status,
                                  updatedAt: new Date().toISOString(),
                                });
                              }}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className=" grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <strong>Created At:</strong>{" "}
                        {new Date(
                          ViewContactRequest.createdAt
                        ).toLocaleDateString("en-US", dateOptions)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <strong>Updated At:</strong>{" "}
                        {new Date(
                          ViewContactRequest.updatedAt
                        ).toLocaleDateString("en-US", dateOptions)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {
                  <AlertDialog>
                    <AlertDialogTrigger className=" mt-4 px-1.5 py-0.5 border rounded-md ">
                      Update
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                        <Textarea
                          value={updateReason}
                          placeholder="Please provide a reason for the update..."
                          onChange={(e) => setUpdateReason(e.target.value)}
                        />
                        <p className="text-red-500 text-sm">required</p>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {updateReason && (
                          <AlertDialogAction
                            onClick={() => {
                              updateContactRequest();
                              setAddOpen(false);
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                }
                <Button
                  className="mt-4"
                  onClick={() => {
                    setAddOpen(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
