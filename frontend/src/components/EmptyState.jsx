export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="text-center text-muted mt-5">
      <p>{message}</p>
      {onAction && (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
