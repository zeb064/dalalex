export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton-line medium" />
        <div className="skeleton-line short" />
        <div className="skeleton-footer">
          <div className="skeleton-price" />
          <div className="skeleton-btn" />
        </div>
      </div>
    </div>
  )
}
