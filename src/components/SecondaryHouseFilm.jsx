export default function SecondaryHouseFilm({ className = '', label = 'STUSH house motion study', compact = false }) {
  return (
    <div className={`secondary-house-film ${compact ? 'secondary-house-film--compact' : ''} ${className}`.trim()} data-qa="secondary-house-film">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src="/STUSH_SECONDARY.mp4"
        aria-label={label}
      />
      <span className="secondary-house-film__veil" aria-hidden="true" />
      <span className="secondary-house-film__mark" aria-hidden="true">STUSH / HOUSE MOTION</span>
    </div>
  );
}
