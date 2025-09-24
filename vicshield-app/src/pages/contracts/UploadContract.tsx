import { useState, useRef } from "react";
import axios from "axios";

const ACCEPT =
  ".pdf,.txt,.md,.rtf,.doc,.docx,application/pdf,text/plain,text/markdown,application/rtf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const resetAll = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setMsg("");
    // Quan trọng: reset giá trị input để lần sau chọn cùng file vẫn trigger onChange
    if (inputRef.current) inputRef.current.value = "";
  };

  const startUpload = async (f: File) => {
    if (status === "uploading") return; // tránh double-trigger
    setFile(f);
    setStatus("uploading");
    setMsg("");
    setProgress(0);

    try {
      const form = new FormData();
      form.append("file", f);
      form.append("purpose", "assistants");

      const res = await axios.post(
        `${import.meta.env.VITE_VICSHIELD_API_URL}/upload`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const p = Math.round((evt.loaded * 100) / evt.total);
            setProgress(p);
          },
        }
      );

      setStatus("done");
      setMsg(`Uploaded: file_id=${res.data?.fileId ?? "unknown"}`);
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.response?.data?.error ?? e?.message ?? "Upload failed");
    } finally {
      // Sau khi xử lý, luôn clear input để lần sau chọn cùng file vẫn nhận
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) startUpload(f);
    // Clear ngay tại đây cũng được (double safety)
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) startUpload(f);
  };

  return (
    <div className="w-full p-6 bg-base-100 rounded-xl shadow-lg mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Upload file</h2>
        <button className="btn btn-xs btn-ghost" onClick={resetAll}>
          ✕
        </button>
      </div>

      {/* Dropzone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          "flex flex-col items-center justify-center w-full h-44 rounded-lg cursor-pointer transition",
          "border-2 border-dashed",
          dragOver ? "border-primary bg-primary/5" : "border-base-300",
          "hover:border-primary",
          status === "uploading" ? "pointer-events-none opacity-70" : "",
        ].join(" ")}
        onClick={() => {
          // Clear trước khi mở dialog để chọn lại cùng file vẫn kích hoạt onChange
          if (inputRef.current) inputRef.current.value = "";
          inputRef.current?.click();
        }}
      >
        <div className="flex flex-col items-center pointer-events-none">
          <p className="mt-2 text-sm">
            Drag & Drop file here or{" "}
            <span className="text-primary font-medium underline">
              Choose file
            </span>
          </p>
          <p className="text-xs text-base-content/60 mt-1">
            Supported: PDF, DOC/DOCX, TXT, MD, RTF · Max ~25MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={onInput}
        />
      </label>

      {/* File info */}
      {file && (
        <div className="mt-4 p-3 rounded-lg border border-base-200 flex items-center justify-between">
          <div className="truncate">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-base-content/60">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button className="btn btn-xs btn-ghost" onClick={resetAll}>
            Remove
          </button>
        </div>
      )}

      {/* Progress */}
      {status === "uploading" && (
        <progress
          className="progress progress-primary w-full mt-3"
          value={progress}
          max={100}
        />
      )}

      {/* Status message */}
      {msg && (
        <div
          className={[
            "mt-3 text-sm",
            status === "error" ? "text-error" : "text-success",
          ].join(" ")}
        >
          {msg}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <button className="btn btn-ghost" onClick={resetAll}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          disabled={status !== "done"}
          onClick={() => {
            resetAll();
            alert(
              "File uploaded successfully! You can now upload another file or browse your contracts below."
            );
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
