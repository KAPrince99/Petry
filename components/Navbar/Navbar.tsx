import { TreePalm } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TreePalm className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            Petry
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          UserButton
        </div>
      </div>
    </header>
  );
}
