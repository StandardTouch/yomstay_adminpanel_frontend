import React, { useState } from "react";
import HtmlEditor from "@/components/ui/html-editor";

function cancellationPolicy() {
  const [content, setContent] = useState("");
  return (
    <div>
      <div>
        <h1 className="text-xl font-bold text-nowrap mb-4 ">Cancellation Policy</h1>
        <HtmlEditor
          value={content}
          placeholder="Enter cancellation policy here..."
          onChange={setContent}
        />
      </div>
    </div>
  );
}

export default cancellationPolicy;
