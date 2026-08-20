interface Props {
  count?: number;
  avatarSize?: string;
}

function UserSelectListSkeleton({
  count = 6,
  avatarSize = "w-12 h-12",
}: Props) {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-2 py-2 rounded-md"
        >
          <div className={`shrink-0 rounded-full bg-gray-200 ${avatarSize}`} />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="ml-auto w-5 h-5 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default UserSelectListSkeleton;
