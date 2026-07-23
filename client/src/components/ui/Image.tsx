// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {}

function Image({ src, alt, className, loading = "lazy", ...rest }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      {...rest}
    />
  );
}

export default Image;
