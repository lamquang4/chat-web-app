interface ConversationListSkeletonProps {
  count?: number;
}

function ConversationListSkeleton({
  count = 6,
}: ConversationListSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="flex items-center gap-3 py-2 px-2 rounded-lg w-full animate-pulse"
          key={index}
        >
          <div className="relative flex shrink-0">
            <div className="w-12 h-12 rounded-full bg-skeleton" />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-1/3 bg-skeleton rounded" />
            <div className="h-3 w-2/3 bg-skeleton rounded" />
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="w-3 h-3 bg-skeleton rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationListSkeleton;
