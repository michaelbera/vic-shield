import { useRef, useEffect, useState } from 'react';
// @ts-ignore
import { Editor } from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

interface ContractEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

const ContractEditor = ({
  initialContent = '',
  onChange,
  placeholder = 'Nhập nội dung hợp đồng...',
  height = '400px',
}: ContractEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = new Editor({
      el: editorRef.current,
      height,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      placeholder,
      initialValue: initialContent,
      autofocus: false,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'link'],
        ['code', 'codeblock'],
      ],
      theme: 'default',
    });

    editorInstanceRef.current = editor;
    setIsReady(true);

    // Listen for content changes
    editor.on('change', () => {
      const content = editor.getHTML();
      onChange(content);
    });

    // Cleanup function
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
        setIsReady(false);
      }
    };
  }, [height, placeholder, initialContent, onChange]);

  // Update editor content when initialContent changes
  useEffect(() => {
    if (isReady && editorInstanceRef.current && initialContent !== editorInstanceRef.current.getHTML()) {
      editorInstanceRef.current.setHTML(initialContent);
    }
  }, [initialContent, isReady]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div ref={editorRef} />
    </div>
  );
};

export default ContractEditor;