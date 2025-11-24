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
  fetchTermsOfUse,
  updateTermsOfUse,
  clearTermsOfUseError,
  clearUpdateError,
} from "../termsOfUseSlice";
import {
  selectTermsOfUse,
  selectTermsOfUseLoading,
  selectTermsOfUseError,
  selectTermsOfUseUpdating,
  selectTermsOfUseUpdateError,
} from "../termsOfUseSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Save } from "lucide-react";

function TermsOfService() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const termsOfUse = useSelector(selectTermsOfUse);
  const loading = useSelector(selectTermsOfUseLoading);
  const error = useSelector(selectTermsOfUseError);
  const updating = useSelector(selectTermsOfUseUpdating);
  const updateError = useSelector(selectTermsOfUseUpdateError);

  // Local state for editor content and locale
  const [isArabic, setIsArabic] = useState(false);
  const [englishHtml, setEnglishHtml] = useState("");
  const [arabicHtml, setArabicHtml] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch terms of use on mount
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(fetchTermsOfUse({ apiClient }));
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient]);

  // Sync editor content with terms of use data
  useEffect(() => {
    if (termsOfUse) {
      setEnglishHtml(termsOfUse.englishHtml || "");
      setArabicHtml(termsOfUse.arabicHtml || "");
      setIsActive(termsOfUse.isActive !== undefined ? termsOfUse.isActive : true);
    }
  }, [termsOfUse]);

  // Display errors
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearTermsOfUseError());
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
    if (termsOfUse) {
      if (englishHtml !== (termsOfUse.englishHtml || "")) {
        updateData.englishHtml = englishHtml;
      }
      if (arabicHtml !== (termsOfUse.arabicHtml || "")) {
        updateData.arabicHtml = arabicHtml;
      }
      if (isActive !== (termsOfUse.isActive !== undefined ? termsOfUse.isActive : true)) {
        updateData.isActive = isActive;
      }
    } else {
      // If no terms of use exists, send all fields
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
        updateTermsOfUse({
          updateData,
          apiClient,
        })
      ).unwrap();

      showSuccess("Terms of use updated successfully");
    } catch (error) {
      // Error is already handled by the thunk and shown via toast
      console.error("Failed to update terms of use:", error);
    }
  };

  // Get current content based on locale
  const currentContent = isArabic ? arabicHtml : englishHtml;
  const setCurrentContent = isArabic ? setArabicHtml : setEnglishHtml;

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-nowrap">Terms of Service</h1>
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
                ? "Enter terms of service in Arabic here..."
                : "Enter terms of service in English here..."
            }
            onChange={setCurrentContent}
          />
        )}
      </div>
    </div>
  );
}

export default TermsOfService;
