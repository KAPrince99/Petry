import { getErrorMessage } from "@/lib/errors/get-error-message";
import { toast } from "sonner";

export function toastSuccess(message: string, id?: string) {
  toast.success(message, { id: id ?? message });
}

export function toastError(
  error: unknown,
  fallback?: string,
  id?: string,
) {
  const message = getErrorMessage(error, fallback);
  toast.error(message, { id: id ?? message });
}
