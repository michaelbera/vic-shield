import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function UploadFile({
  onChange,
}: {
  onChange?: (hashed: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [hashed, setHashed] = useState("");

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const startUpload = async (f: File) => {
    const form = new FormData();
    form.append("file", f);
    form.append("purpose", "assistants");

    const res = await axios.post(
      `${import.meta.env.VITE_VICSHIELD_API_URL}/files/upload`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    setHashed(res.data?.hash ?? "");
    onChange?.(res.data?.hash ?? "");
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      startUpload(f);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-base-content/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-base-100">
      {preview ? (
        <div className="flex flex-col gap-2">
          <img
            src={preview}
            alt="Front of ID"
            className="max-h-32 mx-auto rounded"
          />
          <p className="text-sm text-success">{file?.name}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 pointer-events-none select-none">
          <svg
            className="w-12 h-12 mx-auto text-base-content/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p className="text-sm text-base-content/70">
            Click to upload front image
          </p>
        </div>
      )}

      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={onInput}
      />
      {hashed && <p className="mt-2 text-sm text-secondary">Hash: {hashed}</p>}
    </div>
  );
}
