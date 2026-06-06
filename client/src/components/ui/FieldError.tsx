interface Props {
  message?: string;
}

function FieldError({ message }: Props) {
  if (!message) return null;
  return <p className="text-danger">{message}</p>;
}

export default FieldError;
