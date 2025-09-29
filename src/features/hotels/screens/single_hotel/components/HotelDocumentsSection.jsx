import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const HotelDocumentsSection = memo(
  ({
    documentRequirements = [],
    documentProgress = {
      totalRequired: 0,
      totalUploaded: 0,
      totalApproved: 0,
      completionPercentage: 0,
    },
    onUpdateDocuments,
  }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);

    const handleFileUpload = useCallback(
      (requirementId, file) => {
        // Simulate file upload
        const newDocument = {
          id: Math.random().toString(),
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          status: "pending",
          uploadedAt: new Date().toISOString(),
          rejectionReason: null,
        };

        const updatedRequirements = documentRequirements.map((req) =>
          req.id === requirementId
            ? {
                ...req,
                uploaded: true,
                uploadedDocument: newDocument,
              }
            : req
        );

        onUpdateDocuments(updatedRequirements);
        setIsUploadModalOpen(false);
        setSelectedRequirement(null);
        setUploadFile(null);
      },
      [documentRequirements, onUpdateDocuments]
    );

    const handleFileChange = useCallback((e) => {
      const file = e.target.files[0];
      setUploadFile(file);
    }, []);

    const handleUploadClick = useCallback((requirement) => {
      setSelectedRequirement(requirement);
      setIsUploadModalOpen(true);
    }, []);

    const handleDeleteDocument = useCallback(
      (requirementId) => {
        const updatedRequirements = documentRequirements.map((req) =>
          req.id === requirementId
            ? {
                ...req,
                uploaded: false,
                uploadedDocument: null,
              }
            : req
        );

        onUpdateDocuments(updatedRequirements);
      },
      [documentRequirements, onUpdateDocuments]
    );

    const handleStatusChange = useCallback(
      (requirementId, status, rejectionReason = null) => {
        const updatedRequirements = documentRequirements.map((req) =>
          req.id === requirementId && req.uploadedDocument
            ? {
                ...req,
                uploadedDocument: {
                  ...req.uploadedDocument,
                  status,
                  rejectionReason,
                },
              }
            : req
        );

        onUpdateDocuments(updatedRequirements);
      },
      [documentRequirements, onUpdateDocuments]
    );

    const getStatusIcon = useCallback((status) => {
      switch (status) {
        case "approved":
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case "rejected":
          return <XCircle className="w-4 h-4 text-red-500" />;
        case "expired":
          return <Clock className="w-4 h-4 text-orange-500" />;
        default:
          return <Clock className="w-4 h-4 text-yellow-500" />;
      }
    }, []);

    const getStatusColor = useCallback((status) => {
      switch (status) {
        case "approved":
          return "text-green-600";
        case "rejected":
          return "text-red-600";
        case "expired":
          return "text-orange-600";
        default:
          return "text-yellow-600";
      }
    }, []);

    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h2 className="text-2xl font-semibold">Hotel Documents</h2>
        </div>

        {/* Document Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Document Progress</CardTitle>
            <CardDescription>
              Track your document submission and approval status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{documentProgress.completionPercentage}%</span>
              </div>
              <Progress
                value={documentProgress.completionPercentage}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {documentProgress.totalRequired}
                </div>
                <div className="text-sm text-gray-600">Required</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {documentProgress.totalUploaded}
                </div>
                <div className="text-sm text-gray-600">Uploaded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {documentProgress.totalApproved}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Requirements */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Document Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentRequirements.map((requirement) => (
              <Card key={requirement.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {requirement.displayName}
                      </CardTitle>
                      <CardDescription>{requirement.name}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {requirement.isRequired && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {requirement.description && (
                      <p className="text-sm text-gray-600">
                        {requirement.description}
                      </p>
                    )}

                    {requirement.uploaded && requirement.uploadedDocument ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(requirement.uploadedDocument.status)}
                          <span
                            className={`text-sm ${getStatusColor(
                              requirement.uploadedDocument.status
                            )}`}
                          >
                            {requirement.uploadedDocument.status
                              .charAt(0)
                              .toUpperCase() +
                              requirement.uploadedDocument.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{requirement.uploadedDocument.fileName}</span>
                          <span>•</span>
                          <span>
                            {new Date(
                              requirement.uploadedDocument.uploadedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        {requirement.uploadedDocument.rejectionReason && (
                          <p className="text-sm text-red-600">
                            Rejection reason:{" "}
                            {requirement.uploadedDocument.rejectionReason}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                requirement.uploadedDocument.fileUrl,
                                "_blank"
                              )
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                requirement.uploadedDocument.fileUrl,
                                "_blank"
                              )
                            }
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteDocument(requirement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          No document uploaded
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleUploadClick(requirement)}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload Document
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload {selectedRequirement?.displayName} document
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="document-file">Select File</label>
                <Input
                  id="document-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>

              {uploadFile && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">{uploadFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() =>
                  handleFileUpload(selectedRequirement.id, uploadFile)
                }
                disabled={!uploadFile}
              >
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

HotelDocumentsSection.displayName = "HotelDocumentsSection";

export default HotelDocumentsSection;
