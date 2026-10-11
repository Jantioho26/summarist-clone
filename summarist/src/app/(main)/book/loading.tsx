
export default function Loading() {
  return (
    <div className="book__loading">
      <div className="book__loading--info">
        <div className="skeleton book__loading--title" />
        <div className="skeleton book__loading--author" />
        <div className="skeleton book__loading--subtitle" />
        <div className="skeleton book__loading--button" />
      </div>

      <div className="skeleton book__loading--image" />
    </div>
  );
}
