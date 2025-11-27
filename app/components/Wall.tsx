interface WallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
}

export default function Wall({ 
  position, 
  rotation = [0, 0, 0],
  width = 20,
  height = 7.5,
  color = "#f5f5ff"
}: WallProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}