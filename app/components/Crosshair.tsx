interface CrosshairProps {
  visible?: boolean;
}

export default function Crosshair({ visible = true }: CrosshairProps) {
  if (!visible) return null;
  
  return (
    <div className="pointer-events-none fixed top-1/2 left-1/2 z-50">
      <img
        src="/cursor.svg"   
        alt="crosshair"
        style={{
          width: "30px",
          height: "30px",
          transform: "translate(-50%, -50%)",
          opacity: 0.9,
        }}
      />
    </div>
  );
}