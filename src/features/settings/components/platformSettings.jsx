import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import {
  fetchPlatformSettings,
  updatePlatformSettings as updatePlatformSettingsAction,
  updatePlatformSettingsLocal,
  clearError,
  clearUpdateError,
} from "../settingsSlice";
import {
  selectPlatformSettings,
  selectSettingsLoading,
  selectSettingsError,
  selectSettingsUpdating,
  selectSettingsUpdateError,
} from "../settingsSelectors";
import { showSuccess, showError } from "../../../utils/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { Spinner } from "../../../common/components/spinner";

export default function PlatformSettings() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const platformSettings = useSelector(selectPlatformSettings);
  const loading = useSelector(selectSettingsLoading);
  const error = useSelector(selectSettingsError);
  const updating = useSelector(selectSettingsUpdating);
  const updateError = useSelector(selectSettingsUpdateError);

  // Check for changes (compare with original state)
  const [originalSettings, setOriginalSettings] = useState(null);
  const hasChanges = useMemo(() => {
    if (!originalSettings) return false;
    return (
      JSON.stringify(platformSettings) !== JSON.stringify(originalSettings)
    );
  }, [platformSettings, originalSettings]);

  // Fetch platform settings on mount
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient?.admin) {
      dispatch(fetchPlatformSettings({ apiClient }));
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient]);

  // Store original settings when loaded
  useEffect(() => {
    if (platformSettings.id && !originalSettings) {
      setOriginalSettings(JSON.parse(JSON.stringify(platformSettings)));
    }
  }, [platformSettings.id, originalSettings]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
      dispatch(clearUpdateError());
    }
  }, [updateError, dispatch]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      const newValue = type === "number" ? parseInt(value) || 0 : value;

      dispatch(
        updatePlatformSettingsLocal({
          [name]: newValue,
        })
      );
    },
    [dispatch]
  );

  const handleSave = useCallback(async () => {
    if (!apiClient?.admin) {
      showError("API client not available");
      return;
    }

    try {
      const result = await dispatch(
        updatePlatformSettingsAction({
          settingsData: platformSettings,
          apiClient,
        })
      ).unwrap();

      // Update original settings after successful save
      setOriginalSettings(JSON.parse(JSON.stringify(platformSettings)));
      showSuccess("Platform settings updated successfully!");
      return result;
    } catch (error) {
      console.error("Failed to save platform settings:", error);
      // Error already handled by useEffect
    }
  }, [dispatch, platformSettings, apiClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure validation rules and platform-level settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updating}
          className="flex items-center gap-2"
        >
          {updating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Slot Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStartHour" className="font-semibold">
                Minimum Start Hour
              </Label>
              <Input
                id="minStartHour"
                type="number"
                min="0"
                max="23"
                value={platformSettings.minStartHour}
                name="minStartHour"
                onChange={handleChange}
                placeholder="6"
              />
              <p className="text-xs text-muted-foreground">
                Earliest hour bookings can start (default: 6 AM)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEndHour" className="font-semibold">
                Maximum End Hour
              </Label>
              <Input
                id="maxEndHour"
                type="number"
                min="0"
                max="23"
                value={platformSettings.maxEndHour}
                name="maxEndHour"
                onChange={handleChange}
                placeholder="22"
              />
              <p className="text-xs text-muted-foreground">
                Latest hour bookings can end (default: 10 PM)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minDuration" className="font-semibold">
                Minimum Duration (hours)
              </Label>
              <Input
                id="minDuration"
                type="number"
                min="1"
                value={platformSettings.minDuration}
                name="minDuration"
                onChange={handleChange}
                placeholder="2"
              />
              <p className="text-xs text-muted-foreground">
                Minimum booking duration in hours
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDuration" className="font-semibold">
                Maximum Duration (hours)
              </Label>
              <Input
                id="maxDuration"
                type="number"
                min="1"
                value={platformSettings.maxDuration}
                name="maxDuration"
                onChange={handleChange}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                Maximum booking duration in hours
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDuration" className="font-semibold">
                Default Duration (hours)
              </Label>
              <Input
                id="defaultDuration"
                type="number"
                min="1"
                value={platformSettings.defaultDuration}
                name="defaultDuration"
                onChange={handleChange}
                placeholder="8"
              />
              <p className="text-xs text-muted-foreground">
                Default booking duration (legacy field)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legacy Time Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minCheckInTime" className="font-semibold">
                Minimum Check-In Time
              </Label>
              <Input
                id="minCheckInTime"
                type="time"
                value={platformSettings.minCheckInTime}
                name="minCheckInTime"
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Legacy check-in time format
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCheckOutTime" className="font-semibold">
                Maximum Check-Out Time
              </Label>
              <Input
                id="maxCheckOutTime"
                type="time"
                value={platformSettings.maxCheckOutTime}
                name="maxCheckOutTime"
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Legacy check-out time format
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commissionPercentage" className="font-semibold">
                Commission Percentage
              </Label>
              <Input
                id="commissionPercentage"
                type="number"
                min="0"
                max="100"
                value={platformSettings.commissionPercentage}
                name="commissionPercentage"
                onChange={handleChange}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                Platform commission percentage (e.g., 10 = 10%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platformTaxPercentage" className="font-semibold">
                Platform Tax Percentage
              </Label>
              <Input
                id="platformTaxPercentage"
                type="number"
                min="0"
                max="100"
                value={platformSettings.platformTaxPercentage}
                name="platformTaxPercentage"
                onChange={handleChange}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                Platform-level tax percentage (e.g., 10 = 10%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {platformSettings.updatedAt && (
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(platformSettings.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
