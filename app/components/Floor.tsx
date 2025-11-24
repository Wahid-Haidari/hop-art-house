interface FloorProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
}

export default function Floor({ 
  position = [0, -1, 0],
  width = 20,
  height = 20,
  color = "#f5f5ff"
}: FloorProps) {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} toneMapped={false} />
    </mesh>
  );
}