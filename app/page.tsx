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
import Floor from "./components/Floor";
import { PlayerProvider } from "./components/PlayerContext";
import ProximityMessage from "./components/ProximityMessage";
import Tree from "./components/Tree";
import { artworks } from "./components/artworks";

export default function Home() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  return (
    <PlayerProvider>
      <main className="w-full h-screen">
        <ClickToStart>
          <div
            id="canvas-wrapper"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Canvas 
              camera={{ position: [3, 2.6, 5], fov: 30 }}
              onCreated={({ camera }) => {
                camera.lookAt(0, 2, -10);
              }}
            >
              {/* Light */}
              <ambientLight intensity={1} />
              <directionalLight position={[5, 5, 5]} />
              <Floor/>
              <Tree position={[0, 0, 0]} scale={0.4} />

              {/* Walls */}
              <Wall position={[0, 2, -10]} />
              <Wall position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
              <Wall position={[10, 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
              <Wall position={[0, 2, 10]} rotation={[0, Math.PI, 0]} />

              {/* Artworks - Loop through all artworks */}
              {artworks.map((artwork) => (
                <group key={artwork.id}>
                  <GalleryArtwork
                    art={artwork.art}
                    artistCard={artwork.artistCard}
                    infoCard={artwork.infoCard}
                    position={artwork.position}
                    rotation={artwork.rotation}
                    onOpenOverlay={setOverlayImage}
                  />

                  <ProximityMessage
                    artPosition={artwork.position}
                    artRotation={artwork.rotation}
                    triggerDistance={7}
                  />

                  <PurchasePanel 
                    artPosition={artwork.position}
                    artRotation={artwork.rotation}
                  />
                </group>
              ))}

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
    </PlayerProvider>
  );
}