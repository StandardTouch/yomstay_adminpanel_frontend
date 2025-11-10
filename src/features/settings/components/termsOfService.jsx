import React, { useState } from "react";
import HtmlEditor from "@/components/ui/html-editor";

function termsOfService() {
  const [content, setContent] = useState("");
  return (
    <div>
      <div>
        <h1 className="text-xl font-bold text-nowrap mb-4">Terms of Service</h1>
        <HtmlEditor
          value={content}
          placeholder="Enter terms of service here..."
          onChange={setContent}
        />
      </div>
    </div>
  );
}

export default termsOfService;
