"use client";

import { Canvas } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import Crosshair from "./components/Crosshair";
import Player from "./components/Player";
import GalleryArtwork from "./components/GalleryArtwork";
import PurchasePanel from "./components/PurchasePanel";
import { useState } from "react"; 
import FullscreenOverlay from "./components/FullscreenOverlay";
import Wall from "./components/Wall";
import Floor from "./components/Floor";
import { PlayerProvider } from "./components/PlayerContext";
import ProximityMessage from "./components/ProximityMessage";
import Tree from "./components/Tree";
import { artworks } from "./artworks";
import LandingPage from "./components/LandingPage";
import ClickToLook from "./components/ClickToLook";
import { useRef, useEffect } from "react";

export default function Home() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const controlsRef = useRef<any>(null);

  // Auto-lock pointer when landing page disappears
  useEffect(() => {
    if (!showLanding && controlsRef.current) {
      // Remove auto-lock since browser requires user interaction
    }
  }, [showLanding]);

  const handleLock = () => {
    if (controlsRef.current) {
      controlsRef.current.lock();
    }
  };

  return (
    <PlayerProvider>
      {showLanding && (
        <>
          <LandingPage onEnter={() => setShowLanding(false)} />
          {/* Spacer to enable scrolling */}
          <div className="h-[200vh]" />
        </>
      )}
      <main className="w-full h-screen">
        <div
          id="canvas-wrapper"
          className="w-full h-full"
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
              <PointerLockControls ref={controlsRef} enabled={!overlayImage} />
            </Canvas>
          </div>
        <Crosshair visible={!overlayImage} />
        <FullscreenOverlay
          image={overlayImage}
          onClose={() => setOverlayImage(null)}
        />
        {!showLanding && <ClickToLook onLock={handleLock} />}
      </main>
    </PlayerProvider>
  );
}