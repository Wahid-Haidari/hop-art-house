interface CeilingProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
}

export default function Ceiling({ 
  position = [0, 7.5, 0],
  width = 20,
  height = 20,
  color = "#ffffff"
}: CeilingProps) {
  return (
    <mesh 
      rotation={[Math.PI / 2, 0, 0]}
      position={position}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
