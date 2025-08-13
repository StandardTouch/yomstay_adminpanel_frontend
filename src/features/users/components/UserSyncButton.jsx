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
import { setAuth } from "../../../utils/apiClient";

const UserSyncButton = () => {
  const dispatch = useDispatch();
  const { getToken, isSignedIn } = useAuth();
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

    // Ensure we have a fresh token before proceeding
    if (!isSignedIn) {
      showError("You must be signed in to sync users");
      return;
    }

    try {
      // Get a fresh token
      const freshToken = await getToken();
      if (!freshToken) {
        showError("Failed to get authentication token");
        return;
      }

      // Update the API client with the fresh token
      setAuth(true, freshToken);

      // Show loading toast
      const toastId = showLoading("Syncing users...");

      try {
        const result = await dispatch(
          syncUsers({ forceUpdate, dryRun })
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
          dispatch(fetchUsers());
        } else {
          updateToast(toastId, "error", "Sync failed. Please try again.");
        }
      } catch (error) {
        updateToast(toastId, "error", `Sync failed: ${error}`);
      }
    } catch (error) {
      showError("Authentication error. Please try signing in again.");
      console.error("Token refresh error:", error);
    }
  };

  const handleQuickSync = () => {
    setForceUpdate(false);
    setDryRun(false);
    handleSync();
  };

  return (
    <div className="space-y-4">
      {/* Quick Sync Button */}
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

      {/* Sync Status Badge */}
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

      {/* Sync Options Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSyncOptions(!showSyncOptions)}
        className="w-full text-xs"
      >
        Advanced Sync Options
      </Button>

      {/* Sync Options Panel */}
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

      {/* Sync Summary Display */}
      {lastSyncResult && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>
            Last sync: {lastSyncResult.summary?.totalProcessed || 0} users
            processed
          </span>
        </div>
      )}

      {/* Current Sync Status */}
      {syncSummary.totalUsers > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{syncSummary.syncedUsers} synced</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>{syncSummary.unsyncedUsers} unsynced</span>
            </div>
          </div>

          {/* Sync Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${
                  (syncSummary.syncedUsers / syncSummary.totalUsers) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {syncError && (
        <div className="flex items-center gap-2 text-sm text-destructive justify-center">
          <AlertCircle className="h-4 w-4" />
          <span>{syncError}</span>
        </div>
      )}
    </div>
  );
};

export default UserSyncButton;
