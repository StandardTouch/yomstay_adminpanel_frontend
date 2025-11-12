import React, { useState } from "react";
import HtmlEditor from "@/components/ui/html-editor";

function privacyPolicy() {
  const [content, setContent] = useState("");
  return (
    <div>
      <div>
        <h1 className="text-xl font-bold text-nowrap mb-4">Privacy Policy</h1>
        <HtmlEditor
          value={content}
          placeholder="Enter privacy policy here..."
          onChange={setContent}
        />
      </div>
    </div>
  );
}

export default privacyPolicy;
