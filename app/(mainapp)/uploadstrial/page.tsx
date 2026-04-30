import FileUploader from "@/components/UploadsTrial/FileUploader";

export default function UploadsTrial() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      <h1 className="text-4xl font-semibold my-5">UPLOADS TRIAL</h1>
      <FileUploader />
    </div>
  );
}
