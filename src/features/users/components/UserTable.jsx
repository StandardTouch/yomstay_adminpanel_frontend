import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShimmerTable } from "../../../common/components/Shimmer";
import { ConfirmationPopup } from "@/common/components/Popup";

export default function UserTable({
  users,
  loading,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onEditUser,
  onDeleteUser,
}) {
  // State for sync issues modal
  const [syncIssuesModal, setSyncIssuesModal] = useState({
    open: false,
    user: null,
    issues: [],
  });

  // State for delete confirmation
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    user: null,
  });

  // State for delete loading
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cache busting for profile images - updates when users array changes
  const [imageCacheBuster, setImageCacheBuster] = useState(0);

  // Update cache buster when users change (including profile image updates)
  React.useEffect(() => {
    setImageCacheBuster((prev) => prev + 1);
  }, [users]);

  // Helper function to get cache-busted image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return undefined;
    // Use timestamp + cache buster for more aggressive cache busting
    const finalUrl = `${imageUrl}?cb=${imageCacheBuster}&t=${Date.now()}`;
    console.log("Image URL Debug:", {
      original: imageUrl,
      final: finalUrl,
      cacheBuster: imageCacheBuster,
      timestamp: Date.now(),
    });
    return finalUrl;
  };

  // Handle sync issues click
  const handleSyncIssuesClick = (user) => {
    setSyncIssuesModal({
      open: true,
      user,
      issues: user.syncIssues || [],
    });
  };

  // Handle delete click
  const handleDeleteClick = (user) => {
    setDeleteModal({
      open: true,
      user,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteModal.user && onDeleteUser) {
      setDeleteLoading(true);
      try {
        await onDeleteUser(deleteModal.user);
        setDeleteModal({ open: false, user: null });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModal({ open: false, user: null });
  };

  const allSelected = users.length > 0 && selected.length === users.length;

  // Show shimmer when loading
  if (loading) {
    return <ShimmerTable rows={8} columns={8} />;
  }

  if (users.length === 0) {
    return (
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-8"
              >
                No users found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={
                  user.clerkUser?.id ||
                  user.localUser?.id ||
                  `user-${Math.random()}`
                }
                className={
                  selected.includes(user.clerkUser?.id || user.localUser?.id)
                    ? "bg-muted/50"
                    : ""
                }
              >
                <TableCell>
                  <Checkbox
                    checked={selected.includes(
                      user.clerkUser?.id || user.localUser?.id
                    )}
                    onCheckedChange={() =>
                      onToggleSelect(user.clerkUser?.id || user.localUser?.id)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getImageUrl(user.localUser?.profileImageUrl)}
                        onError={(e) => {
                          console.error("Image failed to load:", {
                            url: e.target.src,
                            user:
                              user.clerkUser?.firstName +
                              " " +
                              user.clerkUser?.lastName,
                            error: e,
                          });
                        }}
                        onLoad={() => {
                          console.log("Image loaded successfully:", {
                            url: user.localUser?.profileImageUrl,
                            user:
                              user.clerkUser?.firstName +
                              " " +
                              user.clerkUser?.lastName,
                          });
                        }}
                      />
                      <AvatarFallback>
                        {user.clerkUser?.firstName?.[0] ||
                          user.localUser?.firstName?.[0]}
                        {user.clerkUser?.lastName?.[0] ||
                          user.localUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.clerkUser?.firstName || user.localUser?.firstName}{" "}
                        {user.clerkUser?.lastName || user.localUser?.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.clerkUser?.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.clerkUser?.email || user.localUser?.email}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={
                        user.clerkUser?.publicMetadata?.role === "admin"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.clerkUser?.publicMetadata?.role || "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{user.localUser?.phone || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm">
                      Clerk:{" "}
                      {new Date(user.clerkUser?.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      Local:{" "}
                      {new Date(user.localUser?.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={user.isSynced ? "default" : "destructive"}
                      className={
                        !user.isSynced && user.syncIssues?.length > 0
                          ? "cursor-pointer hover:opacity-80"
                          : ""
                      }
                      onClick={() => handleSyncIssuesClick(user)}
                    >
                      {user.isSynced ? "Synced" : "Unsynced"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(user)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Sync Issues Modal */}
      <Dialog
        open={syncIssuesModal.open}
        onOpenChange={(open) =>
          setSyncIssuesModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Sync Issues
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={getImageUrl(
                    syncIssuesModal.user?.localUser?.profileImageUrl
                  )}
                />
                <AvatarFallback>
                  {syncIssuesModal.user?.clerkUser?.firstName?.[0] ||
                    syncIssuesModal.user?.localUser?.firstName?.[0]}
                  {syncIssuesModal.user?.clerkUser?.lastName?.[0] ||
                    syncIssuesModal.user?.localUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {syncIssuesModal.user?.clerkUser?.firstName ||
                    syncIssuesModal.user?.localUser?.firstName}{" "}
                  {syncIssuesModal.user?.clerkUser?.lastName ||
                    syncIssuesModal.user?.localUser?.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {syncIssuesModal.user?.clerkUser?.email ||
                    syncIssuesModal.user?.localUser?.email}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Issues Found:
              </h4>
              <div className="space-y-2">
                {syncIssuesModal.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-destructive/10 rounded border border-destructive/20"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-destructive">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationPopup
        isOpen={deleteModal.open}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete user "${
          deleteModal.user?.clerkUser?.firstName ||
          deleteModal.user?.localUser?.firstName
        } ${
          deleteModal.user?.clerkUser?.lastName ||
          deleteModal.user?.localUser?.lastName
        }"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
        icon={Trash2}
        isLoading={deleteLoading}
      />
    </>
  );
}
