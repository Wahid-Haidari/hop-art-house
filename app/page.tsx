"use client";

import { Canvas } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import Crosshair from "./components/Crosshair";
import Player from "./components/Player";
import GalleryArtwork from "./components/GalleryArtwork";
import ClickToStart from "./components/ClickToStart";
import PurchasePanel from "./components/PurchasePanel";
import { useState } from "react"; 
import FullscreenOverlay from "./components/FullscreenOverlay";
import Wall from "./components/Wall";

export default function Home() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  return (
    <main className="w-full h-screen">
      <ClickToStart>
        <div
          id="canvas-wrapper"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas camera={{ position: [3, 1.6, 3], fov: 30 }}>
            {/* Light */}
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} />

            {/* Floor */}
            <mesh  
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1, 0]}
            >
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#f5f5ff" />
            </mesh>

            // Inside your Canvas:
            {/* Walls */}
            <Wall position={[0, 1, -10]} />  {/* Back */}
            <Wall position={[-10, 1, 0]} rotation={[0, Math.PI / 2, 0]} />  {/* Left */}
            <Wall position={[10, 1, 0]} rotation={[0, -Math.PI / 2, 0]} />  {/* Right */}
            <Wall position={[0, 1, 10]} rotation={[0, Math.PI, 0]} />  {/* Front */}

            

            {/* Artwork #1 (back wall) */}
            <GalleryArtwork
              art="/art1.jpeg"
              artistCard="/artist1.jpeg"
              infoCard="/art1info.jpeg"
              position={[0, 1.5, -9.95]}
              rotation={[0, 0, 0]}
              onOpenOverlay={setOverlayImage}
            />

            <PurchasePanel 
              artPosition={[0, 1.5, -9.95]}
              artRotation={[0, 0, 0]}
            />

            {/* Artwork #2 (left wall) */}
            <GalleryArtwork
              art="/art2.jpg"
              artistCard="/artist2.jpg"
              infoCard="/art2info.jpg"
              position={[-9.9, 1.5, 0]}
              rotation={[0, Math.PI / 2, 0]}
              onOpenOverlay={setOverlayImage}
            />

            <Player />
            <PointerLockControls enabled={!overlayImage} />
          </Canvas>
        </div>
      </ClickToStart>
      <Crosshair visible={!overlayImage} />
      <FullscreenOverlay
        image={overlayImage}
        onClose={() => setOverlayImage(null)}
      />
    </main>
  );
}