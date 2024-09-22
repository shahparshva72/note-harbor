// components/NoteCardSkeleton.tsx
import { Card } from "@/components/ui/card";

const NoteCardSkeleton = () => {
  return (
    <Card className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-6 w-3/4 animate-pulse bg-gray-200 rounded"></div>
      <div className="h-4 w-full animate-pulse bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 animate-pulse bg-gray-200 rounded"></div>
      <div className="mt-auto flex flex-col space-y-1">
        <div className="h-3 w-1/2 animate-pulse bg-gray-200 rounded"></div>
        <div className="h-3 w-2/3 animate-pulse bg-gray-200 rounded"></div>
      </div>
    </Card>
  );
};

export default NoteCardSkeleton;