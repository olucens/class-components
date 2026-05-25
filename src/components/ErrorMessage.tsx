export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error">
      <p>😕 Something went wrong:</p>
      <p className="error__message">{message}</p>
    </div>
  );
};