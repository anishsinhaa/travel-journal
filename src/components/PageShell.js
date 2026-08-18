export default function PageShell({ children, title, action }) {
  return (
    <div className="page-container">
      {(title || action) && (
        <div className="page-title-row">
          {title && <h2 className="page-title">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
