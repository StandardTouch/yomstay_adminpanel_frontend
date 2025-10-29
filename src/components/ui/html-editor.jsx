import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

const HtmlEditor = React.forwardRef(
  ({ value, onChange, placeholder, className, ...props }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 underline",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto rounded",
          },
        }),
      ],
      content: value || "",
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl",
            "max-w-none focus:outline-none",
            "min-h-[200px] p-4",
            "dark:prose-invert"
          ),
        },
      },
      placeholder,
    });

    // Update editor content when value prop changes
    useEffect(() => {
      if (editor && value !== undefined && value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }, [value, editor]);

    // Expose editor via ref if needed
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(editor);
        } else {
          ref.current = editor;
        }
      }
    }, [editor, ref]);

    if (!editor) {
      return (
        <div className={cn("space-y-2", className)}>
          <div className="w-full min-h-[200px] p-3 border rounded-md bg-background animate-pulse flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      );
    }

    const MenuBar = () => (
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-gray-900 rounded-t-md">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bold") && "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("strike") && "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "h-8 px-2 text-xs",
            editor.isActive("heading", { level: 1 }) &&
              "bg-gray-200 dark:bg-gray-700"
          )}
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "h-8 px-2 text-xs",
            editor.isActive("heading", { level: 2 }) &&
              "bg-gray-200 dark:bg-gray-700"
          )}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "h-8 px-2 text-xs",
            editor.isActive("heading", { level: 3 }) &&
              "bg-gray-200 dark:bg-gray-700"
          )}
        >
          H3
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") && "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList") && "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "left" }) &&
              "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "center" }) &&
              "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "right" }) &&
              "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("link") && "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Image */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    );

    return (
      <div
        className={cn(
          "html-editor-wrapper border rounded-md overflow-hidden",
          className
        )}
      >
        <MenuBar />
        <EditorContent
          editor={editor}
          className="border-t bg-background"
          {...props}
        />
      </div>
    );
  }
);

HtmlEditor.displayName = "HtmlEditor";

export default HtmlEditor;
