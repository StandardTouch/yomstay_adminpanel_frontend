// SYNC FUNCTIONALITY COMMENTED OUT - ENTIRE COMPONENT DISABLED
/*
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import {
  syncUsers,
  clearSyncError,
  clearLastSyncResult,
  fetchUsers,
} from "../usersSlice";
import {
  selectUsersSyncLoading,
  selectUsersSyncError,
  selectUsersLastSyncResult,
  selectUsersSyncSummary,
} from "../usersSelectors";
import {
  showSuccess,
  showError,
  showLoading,
  showWarning,
  updateToast,
} from "../../../utils/toast";
import { useApi } from "../../../contexts/ApiContext";

const UserSyncButton = () => {
  const dispatch = useDispatch();
  const { isSignedIn } = useAuth();
  const apiClient = useApi();
  const syncLoading = useSelector(selectUsersSyncLoading);
  const syncError = useSelector(selectUsersSyncError);
  const lastSyncResult = useSelector(selectUsersLastSyncResult);
  const syncSummary = useSelector(selectUsersSyncSummary);

  const [showSyncOptions, setShowSyncOptions] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [dryRun, setDryRun] = useState(false);

  const handleSync = async () => {
    // Clear previous results and errors
    dispatch(clearSyncError());
    dispatch(clearLastSyncResult());

    // Ensure user is signed in
    if (!isSignedIn) {
      showError("You must be signed in to sync users");
      return;
    }

    // Show loading toast
    const toastId = showLoading("Syncing users...");

    try {
      const result = await dispatch(
        syncUsers({ syncOptions: { forceUpdate, dryRun }, apiClient })
      ).unwrap();

      if (result.success) {
        const summary = result.data.summary;
        const message = `Sync completed! Processed ${
          summary.totalProcessed
        } users. Created: ${
          summary.createdInClerk + summary.createdInLocal
        }, Updated: ${
          summary.updatedInClerk + summary.updatedInLocal
        }, Skipped: ${summary.skipped}, Failed: ${summary.failed}`;

        updateToast(toastId, "success", message);

        // Show detailed results
        if (summary.failed > 0) {
          showWarning(
            `${summary.failed} users failed to sync. Check the details below.`
          );
        }

        // Refresh users data to show updated sync status
        dispatch(fetchUsers({ apiClient }));
      } else {
        updateToast(toastId, "error", "Sync failed. Please try again.");
      }
    } catch (error) {
      console.error("Sync error:", error);
      updateToast(toastId, "error", `Sync failed: ${error}`);
    }
  };

  const handleQuickSync = () => {
    setForceUpdate(false);
    setDryRun(false);
    handleSync();
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleQuickSync}
        disabled={syncLoading}
        className="w-full gap-2"
        variant="default"
      >
        {syncLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {syncLoading ? "Syncing..." : "Sync Now"}
      </Button>

      {syncSummary.totalUsers > 0 && (
        <div className="flex items-center justify-center">
          <Badge
            variant={syncSummary.unsyncedUsers === 0 ? "default" : "secondary"}
            className="gap-1"
          >
            {syncSummary.unsyncedUsers === 0 ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {syncSummary.unsyncedUsers === 0
              ? "All Synced"
              : `${syncSummary.unsyncedUsers} Unsynced`}
          </Badge>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSyncOptions(!showSyncOptions)}
        className="w-full text-xs"
      >
        Advanced Sync Options
      </Button>

      {showSyncOptions && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={forceUpdate}
                onChange={(e) => setForceUpdate(e.target.checked)}
                className="rounded border-input"
              />
              Force Update
            </label>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="rounded border-input"
              />
              Dry Run
            </label>
          </div>

          <Button
            onClick={handleSync}
            disabled={syncLoading}
            size="sm"
            variant="secondary"
            className="w-full"
          >
            {syncLoading ? "Syncing..." : "Sync with Options"}
          </Button>
        </div>
      )}

      {lastSyncResult && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>
            Last sync: {lastSyncResult.summary?.totalProcessed || 0} users
            processed
          </span>
        </div>
      )}

      {syncSummary.totalUsers > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Users:</span>
            <Badge variant="outline" className="text-xs">
              {syncSummary.totalUsers}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Synced:</span>
            <Badge variant="default" className="text-xs">
              {syncSummary.syncedUsers}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Unsynced:</span>
            <Badge
              variant={syncSummary.unsyncedUsers > 0 ? "destructive" : "outline"}
              className="text-xs"
            >
              {syncSummary.unsyncedUsers}
            </Badge>
          </div>
        </div>
      )}

      {syncError && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <span className="text-sm text-destructive">{syncError}</span>
        </div>
      )}
    </div>
  );
};

export default UserSyncButton;
*/

// Placeholder component to prevent import errors
const UserSyncButton = () => {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p className="text-sm">Sync functionality is currently disabled</p>
    </div>
  );
};

export default UserSyncButton;
