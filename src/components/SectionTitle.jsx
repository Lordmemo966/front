export default function SectionTitle({ children }) {
  return (
    <div className="section-title">
      <div className="title-line" />
      <h2>✦ {children} ✦</h2>
      <div className="title-line" />
    </div>
  );
}
