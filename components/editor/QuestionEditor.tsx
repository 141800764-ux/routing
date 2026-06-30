"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import { Button } from "@/components/ui/button";

const lowlight = createLowlight(common);

type Props = {
  content: string;
  setContent: (value: string) => void;
};

export default function QuestionEditor({ content, setContent }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-white/10 rounded-lg bg-[#0b1220] text-white">

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-2">

        <Button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>

        <Button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>

        <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Button>

        <Button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </Button>

        <Button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code
        </Button>

      </div>

      {/* EDITOR AREA */}
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}