{/* Crosshair cursor*/}

export default function Crosshair() {
  return (
    <div className="pointer-events-none fixed top-1/2 left-1/2 z-50">
    <img
        src="/cursor.svg"   
        alt="crosshair"
        style={{
        width: "30px",      // or smaller if needed
        height: "30px",
        transform: "translate(-50%, -50%)",
        opacity: 0.9,
        }}
    />
    </div>
    );
}