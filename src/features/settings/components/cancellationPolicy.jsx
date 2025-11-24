import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import HtmlEditor from "@/components/ui/html-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/common/components/spinner";
import {
  fetchCancellationPolicy,
  updateCancellationPolicy,
  clearCancellationPolicyError,
  clearUpdateError,
} from "../cancellationPolicySlice";
import {
  selectCancellationPolicy,
  selectCancellationPolicyLoading,
  selectCancellationPolicyError,
  selectCancellationPolicyUpdating,
  selectCancellationPolicyUpdateError,
} from "../cancellationPolicySelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Save } from "lucide-react";

function CancellationPolicy() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const policy = useSelector(selectCancellationPolicy);
  const loading = useSelector(selectCancellationPolicyLoading);
  const error = useSelector(selectCancellationPolicyError);
  const updating = useSelector(selectCancellationPolicyUpdating);
  const updateError = useSelector(selectCancellationPolicyUpdateError);

  // Local state for editor content and locale
  const [isArabic, setIsArabic] = useState(false);
  const [englishHtml, setEnglishHtml] = useState("");
  const [arabicHtml, setArabicHtml] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch policy on mount
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(fetchCancellationPolicy({ apiClient }));
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient]);

  // Sync editor content with policy data
  useEffect(() => {
    if (policy) {
      setEnglishHtml(policy.englishHtml || "");
      setArabicHtml(policy.arabicHtml || "");
      setIsActive(policy.isActive !== undefined ? policy.isActive : true);
    }
  }, [policy]);

  // Display errors
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearCancellationPolicyError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
      dispatch(clearUpdateError());
    }
  }, [updateError, dispatch]);

  // Handle save
  const handleSave = async () => {
    if (!apiClient) return;

    const updateData = {};
    
    // Only include fields that have changed
    if (policy) {
      if (englishHtml !== (policy.englishHtml || "")) {
        updateData.englishHtml = englishHtml;
      }
      if (arabicHtml !== (policy.arabicHtml || "")) {
        updateData.arabicHtml = arabicHtml;
      }
      if (isActive !== (policy.isActive !== undefined ? policy.isActive : true)) {
        updateData.isActive = isActive;
      }
    } else {
      // If no policy exists, send all fields
      updateData.englishHtml = englishHtml;
      updateData.arabicHtml = arabicHtml;
      updateData.isActive = isActive;
    }

    // If nothing changed, don't make API call
    if (Object.keys(updateData).length === 0) {
      showError("No changes to save");
      return;
    }

    try {
      await dispatch(
        updateCancellationPolicy({
          updateData,
          apiClient,
        })
      ).unwrap();

      showSuccess("Cancellation policy updated successfully");
    } catch (error) {
      // Error is already handled by the thunk and shown via toast
      console.error("Failed to update cancellation policy:", error);
    }
  };

  // Get current content based on locale
  const currentContent = isArabic ? arabicHtml : englishHtml;
  const setCurrentContent = isArabic ? setArabicHtml : setEnglishHtml;

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-nowrap">Cancellation Policy</h1>
          <div className="flex items-center gap-4">
            {/* AR Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="ar-toggle" className="text-sm">
                English
              </Label>
              <Switch
                id="ar-toggle"
                checked={isArabic}
                onCheckedChange={setIsArabic}
              />
              <Label htmlFor="ar-toggle" className="text-sm">
                Arabic
              </Label>
            </div>
            {/* Active Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="active-toggle" className="text-sm">
                Active
              </Label>
              <Switch
                id="active-toggle"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={updating}
              />
            </div>
            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={updating || loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {updating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <HtmlEditor
            value={currentContent}
            placeholder={
              isArabic
                ? "Enter cancellation policy in Arabic here..."
                : "Enter cancellation policy in English here..."
            }
            onChange={setCurrentContent}
          />
        )}
      </div>
    </div>
  );
}

export default CancellationPolicy;
