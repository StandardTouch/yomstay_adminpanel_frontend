import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SingleSupportRequest from "./singleSupportRequest";

function supportRequest() {
  const dummyContent = [
    {
      statusCode: 200,
      data: {
        requests: [
          {
            id: "689ca137-3b42-4233-b775-fa172f0785ca",
            type: "hotel_partner",
            category: "billing",
            priority: "high",
            status: "open",
            userId: "947e492e-64b0-4416-9c59-9fa5f370cb97",
            email: "kahkashan@standardtouch.com",
            name: "kahkashan",
            phone: "63612317765",
            subject: "testing",
            message: "testing",
            bookingId: null,
            hotelId: null,
            adminResponse: null,
            respondedBy: null,
            respondedAt: null,
            attachments: [],
            createdAt: "2025-11-25T11:11:55.466Z",
            updatedAt: "2025-11-25T11:11:55.466Z",
            resolvedAt: null,
            closedAt: null,
            ar: {
              subject: "testing",
              message: "testing",
              adminResponse: null,
            },
            user: {
              id: "947e492e-64b0-4416-9c59-9fa5f370cb97",
              email: "yaseen+partner@standardtouch.com",
              firstName: "Hotel Partner",
              lastName: "Yaseen",
            },
          },
          {
            id: "582698e6-762a-4010-bb9b-190d6740ab71",
            type: "hotel_partner",
            category: "general",
            priority: "medium",
            status: "open",
            userId: "947e492e-64b0-4416-9c59-9fa5f370cb97",
            email: "user@example.com",
            name: "John Doe",
            phone: "+966501234567",
            subject: "Issue with booking",
            message: "I need help with my booking",
            bookingId: null,
            hotelId: null,
            adminResponse: null,
            respondedBy: null,
            respondedAt: null,
            attachments: [],
            createdAt: "2025-11-25T10:55:26.512Z",
            updatedAt: "2025-11-25T10:55:26.512Z",
            resolvedAt: null,
            closedAt: null,
            ar: {
              subject: "مشكلة في الحجز",
              message: "أحتاج مساعدة في حجزي",
              adminResponse: null,
            },
            user: {
              id: "947e492e-64b0-4416-9c59-9fa5f370cb97",
              email: "yaseen+partner@standardtouch.com",
              firstName: "Hotel Partner",
              lastName: "Yaseen",
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      },
      message: "Support requests retrieved successfully",
      success: true,
    },
  ];

  const [showModal, setShowModal] = useState(true);
  const [request, setRequest] = useState(0);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "low") return "default";
    if (statusLower === "medium") return "secondary";
    if (statusLower === "high" || statusLower === "canceled")
      return "destructive";
    return "outline";
  };
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">
          {!showModal ? "Single Support Request" : "Support Request"}
        </h1>
        {!showModal && (
          <Button variant="default" onClick={() => setShowModal(true)}>
            Back
          </Button>
        )}
      </div>
      <Card>
        {showModal && (
          <div className="w-full overflow-x-auto px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyContent[0].data.requests.map((request, index) => (
                  <TableRow
                    key={request.id}
                    onClick={() => {
                      setShowModal(false);
                      setRequest(index);
                    }}
                  >
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.subject}</TableCell>
                    <TableCell>{request.message}</TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      {/* <Badge
                        className={`${
                          request.priority === "high"
                            ? "bg-red-500 text-white"
                            : request.priority === "medium"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {request.priority}
                      </Badge> */}
                      <Badge variant={getStatusVariant(request.priority)}>
                        {request.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!showModal && (
          <SingleSupportRequest
            request={dummyContent[0].data.requests[request]}
          />
        )}
      </Card>
    </div>
  );
}

export default supportRequest;
