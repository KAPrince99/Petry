"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      setStatus("success");
      setUploadProgress(100);
    } catch (error) {
      setStatus("error");
      setUploadProgress(0);
    }
  };
  return (
    <div className="space-y-2">
      <Input
        type="file"
        className="cursor-pointer"
        onChange={handleFileChange}
      />

      {file && (
        <div className="mb-4 text-sm">
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )}

      {file && status === "uploading" && (
        <div className="mb-4">
          <p>Upload Progress: {uploadProgress}%</p>
        </div>
      )}

      {file && (
        <Button
          disabled={status === "uploading"}
          onClick={handleFileUpload}
          className="px-5 cursor-pointer"
        >
          {status === "uploading" ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Upload"
          )}
        </Button>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600">File uploaded successfully!</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">Upload failed. Please try again.</p>
      )}
    </div>
  );
}
