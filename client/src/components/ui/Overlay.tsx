interface Props {
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}
function Overlay({ onClose, children, className }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col gap-10 items-center justify-center text-center bg-black/50 z-12 ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default Overlay;
