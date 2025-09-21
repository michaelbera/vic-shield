import { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileContent: (content: string, fileName: string) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

const FileUpload = ({
  onFileContent,
  acceptedTypes = ['.txt', '.pdf', 'text/plain', 'application/pdf'],
  maxSizeMB = 10,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setUploading(true);
    
    try {
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`);
      }

      let content = '';
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // Handle text files
        content = await file.text();
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF files, we'll simulate extraction (in a real app, you'd use a PDF parser)
        content = `[Nội dung PDF từ file: ${file.name}]\n\nĐây là nội dung mô phỏng từ file PDF. Trong thực tế, cần sử dụng thư viện như pdf-parse hoặc PDF.js để trích xuất văn bản từ PDF.\n\nFile: ${file.name}\nKích thước: ${(file.size / 1024).toFixed(2)} KB\nLoại: ${file.type}`;
      } else {
        throw new Error('Định dạng file không được hỗ trợ. Chỉ chấp nhận .txt và .pdf');
      }

      onFileContent(content, file.name);
    } catch (error) {
      console.error('Error processing file:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý file');
    } finally {
      setUploading(false);
    }
  }, [maxSizeMB, onFileContent]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input
    e.target.value = '';
  }, [processFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, [processFile]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
        />
        
        <div className="space-y-3">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="loading loading-spinner loading-md"></span>
              <p className="text-sm text-gray-600">Đang xử lý file...</p>
            </div>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Kéo thả file hoặc click để chọn
                </p>
                <p className="text-xs text-gray-500">
                  Hỗ trợ file .txt và .pdf (tối đa {maxSizeMB}MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;