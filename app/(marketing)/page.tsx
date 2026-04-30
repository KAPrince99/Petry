import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      LANDING PAGE
      <div className="flex gap-4 mt-4">
        <Button>
          <Link href="/dashboard" className="flex gap-2 items-center">
            Go to Dashboard <MoveRight />
          </Link>
        </Button>
        <Button>
          <Link href="/uploadstrial" className="flex gap-2 items-center">
            Go to UploadsTrial <MoveRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
