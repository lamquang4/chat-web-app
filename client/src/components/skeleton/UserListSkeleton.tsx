interface Props {
  count?: number;
  avatarSize?: string;
  showSubtitle?: boolean;
  showExtra?: boolean;
  extraCount?: number;
}

function UserListSkeleton({
  count = 6,
  avatarSize = "w-12 h-12",
  showSubtitle = false,
  showExtra = false,
  extraCount = 2,
}: Props) {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-6 border border-gray-200 py-2 px-2 rounded-lg w-full animate-pulse flex-1"
        >
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-3 items-center flex-1 min-w-0">
              <div
                className={`shrink-0 rounded-full bg-gray-200 ${avatarSize}`}
              />

              <div className="flex flex-col gap-2 min-w-0 flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                {showSubtitle && (
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                )}
              </div>
            </div>
          </div>

          {showExtra && (
            <div className="flex gap-4">
              {Array.from({ length: extraCount }).map((_, extraIndex) => (
                <div
                  key={extraIndex}
                  className="h-8 w-full bg-gray-200 rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserListSkeleton;
