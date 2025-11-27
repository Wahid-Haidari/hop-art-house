"use client";

import { Canvas } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import GalleryArtwork from "./components/GalleryArtwork";
import PurchasePanel from "./components/PurchasePanel";
import { useState, useRef, useEffect } from "react"; 
import FullscreenOverlay from "./components/FullscreenOverlay";
import Wall from "./components/Wall";
import Floor from "./components/Floor";
import Ceiling from "./components/Ceiling";
import { PlayerProvider } from "./components/PlayerContext";
import ProximityMessage from "./components/ProximityMessage";
import Tree from "./components/Tree";
import { artworks } from "./artworks";
import LandingPage from "./components/LandingPage";
import { CartProvider } from "./components/CartContext";
import GalleryHeader from "./components/GalleryHeader";
import AssistancePanel from "./components/AssistancePanel";
import Player from "./components/Player";  // Changed from Player
import MobileControls from "./components/MobileControls";  // New import

export default function Home() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const controlsRef = useRef<any>(null);
  const keysRef = useRef<Record<string, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
    " ": false,
    Shift: false,
  });

  // Track keyboard state
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      const key = e.key === " " ? " " : e.key.toLowerCase();
      if (key in keysRef.current) {
        keysRef.current[key] = true;
        // Lock pointer when movement key is pressed
        if (!document.pointerLockElement && controlsRef.current) {
          controlsRef.current.lock();
        }
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      const key = e.key === " " ? " " : e.key.toLowerCase();
      if (key in keysRef.current) {
        keysRef.current[key] = false;
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  // Check periodically if any movement keys are pressed, unlock if none are
  useEffect(() => {
    const interval = setInterval(() => {
      const anyKeyPressed = Object.values(keysRef.current).some(v => v);
      const isLocked = !!document.pointerLockElement;
      
      if (!anyKeyPressed && isLocked && controlsRef.current) {
        console.log("Releasing pointer lock - no keys pressed");
        document.exitPointerLock();
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, []);

  // Auto-lock pointer when landing page disappears
  useEffect(() => {
    if (!showLanding && controlsRef.current) {
      // Remove auto-lock since browser requires user interaction
    }
  }, [showLanding]);

  return (
    <CartProvider>
      <PlayerProvider>
      {showLanding && (
        <>
          <LandingPage onEnter={() => setShowLanding(false)} />
          {/* Spacer to enable scrolling */}
          <div className="h-[200vh]" />
        </>
      )}
      <main className="w-full h-screen" onClick={() => {
        // Re-lock pointer immediately after click if movement keys are held
        const anyKeyPressed = Object.values(keysRef.current).some(v => v);
        if (anyKeyPressed && !document.pointerLockElement && controlsRef.current) {
          setTimeout(() => {
            if (controlsRef.current) {
              controlsRef.current.lock();
            }
          }, 10);
        }
      }}>
        <div
          id="canvas-wrapper"
          className="w-full h-full"
        >
            <Canvas 
              camera={{ position: [3, 2.6, 5], fov: 30 }}
              onCreated={({ camera }) => {
                camera.lookAt(0, 2, -10);
              }}
              style={{ pointerEvents: 'auto', cursor: 'auto' }}
              onClick={(event) => {
                // Ensure clicks are processed with correct mouse coordinates
                event.stopPropagation?.();
              }}
            >
              {/* Light */}
              <ambientLight intensity={1} />
              <directionalLight position={[5, 5, 5]} />
              <Floor/>
              <Ceiling/>
              <Tree position={[0, 0, 0]} scale={0.4} />

              {/* Walls */}
              <Wall position={[0, 3.75, -10]} />
              <Wall position={[-10, 3.75, 0]} rotation={[0, Math.PI / 2, 0]} />
              <Wall position={[10, 3.75, 0]} rotation={[0, -Math.PI / 2, 0]} />
              <Wall position={[0, 3.75, 10]} rotation={[0, Math.PI, 0]} />

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
                    artworkId={artwork.id}
                    artworkTitle={artwork.title}
                    artworkImage={artwork.art}
                    artPosition={artwork.position}
                    artRotation={artwork.rotation}
                  />
                </group>
              ))}

              <Player />
              <PointerLockControls ref={controlsRef} enabled={!overlayImage} />
            </Canvas>
            <MobileControls/>
          </div>
        <FullscreenOverlay
          image={overlayImage}
          onClose={() => setOverlayImage(null)}
        />
        {!showLanding && <GalleryHeader />}
        {!showLanding && <AssistancePanel visible={!showLanding} />}
      </main>
      
    </PlayerProvider>
    </CartProvider>
  );
}