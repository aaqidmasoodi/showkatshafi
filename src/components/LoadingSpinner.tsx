import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-10 h-10 animate-spin text-gray-700" />
    </div>
  );
}