"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import GalleryArtwork from "./components/GalleryArtwork";
import PurchasePanel from "./components/PurchasePanel";
import { useState, useEffect, Suspense } from "react"; 
import FullscreenOverlay from "./components/FullscreenOverlay";
import Wall from "./components/Wall";
import Floor from "./components/Floor";
import Ceiling from "./components/Ceiling";
import { PlayerProvider } from "./components/PlayerContext";
import ProximityMessage from "./components/ProximityMessage";
import ArtNote from "./components/ArtNote";
import Plant from "./components/Plant";
import { useArtworks } from "./hooks/useArtworks";
import { CartProvider } from "./components/CartContext";
import GalleryFooter from "./components/GalleryFooter";
import AssistancePanel from "./components/AssistancePanel";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";
import RotatePhone from "./components/RotatePhone";
import { useMobile } from "./hooks/useMobile";

export default function Home() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [showRotatePhone, setShowRotatePhone] = useState(false);
  const [galleryReady, setGalleryReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const isMobile = useMobile();
  const { artworks, isLoading } = useArtworks();

  // On mount, check if mobile in portrait mode
  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    
    if (mobile && window.innerHeight > window.innerWidth) {
      setShowRotatePhone(true);
    }
  }, []);

  const handleLandscape = () => {
    setShowRotatePhone(false);
  };

  // Called when Canvas is created - add a small delay for room textures, then fade out
  const handleCanvasCreated = ({ camera }: { camera: THREE.Camera }) => {
    camera.lookAt(10, 3.6, 0);
    // Wait a moment for room textures to load, then start fade
    setTimeout(() => {
      setFadeOut(true);
      // Remove overlay completely after fade animation
      setTimeout(() => setGalleryReady(true), 500);
    }, 3000);
  };

  // Set body styles - yellow background while loading
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = "0";
    document.body.style.left = "0";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";
    document.body.style.background = "#F7C41A";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.setProperty('background', '#F7C41A', 'important');
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.background = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.background = "";
    };
  }, []);

  return (
    <CartProvider>
      <PlayerProvider>
      {showRotatePhone && (
        <RotatePhone onLandscape={handleLandscape} />
      )}
      {/* Yellow loading overlay - covers everything until Canvas is ready */}
      {!galleryReady && !showRotatePhone && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#F7C41A",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? "20px" : "30px",
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 500ms ease-out",
          }}
        >
          <img 
            src="/Landing Page/AI.svg" 
            alt="AI"
            style={{
              width: isMobile ? "80px" : "150px",
              height: "auto",
            }}
          />
          <img 
            src="/Landing Page/ART IS HUMAN.svg" 
            alt="Art is Human"
            style={{
              width: isMobile ? "180px" : "271px",
              height: "auto",
            }}
          />
          <div 
            className="font-[family-name:var(--font-avant-garde-book)]"
            style={{ 
              fontSize: isMobile ? "14px" : "18px", 
              color: "#000",
              marginTop: "20px"
            }}
          >
            Loading...
          </div>
        </div>
      )}
      {/* Gallery */}
      <main style={{ 
        touchAction: "none", 
        position: "fixed", 
        top: 0, 
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        visibility: showRotatePhone ? "hidden" : "visible",
        pointerEvents: showRotatePhone ? "none" : "auto",
        background: "#F7C41A",
      }}>
        <div
          id="canvas-wrapper"
          style={{ background: "#F7C41A" }}
        >
            <Canvas 
              camera={{ position: [0, 3.6, 4], fov: 30 }}
              gl={{ 
                antialias: true,
                toneMapping: 0, // NoToneMapping
                outputColorSpace: 'srgb'
              }}
              onCreated={handleCanvasCreated}
            style={{ 
              pointerEvents: 'auto', 
              cursor: 'auto',
              display: 'block',
              background: "#F7C41A",
              }}
              onClick={(event) => {
                // Ensure clicks are processed with correct mouse coordinates
                event.stopPropagation?.();
              }}
            >
              {/* Lighting - shows immediately */}
              <ambientLight intensity={2} />
              <directionalLight position={[5, 10, 5]} intensity={1} />
              <directionalLight position={[-5, 10, -5]} intensity={0.5} />
              <pointLight position={[0, 6, 0]} intensity={0.5} />
              
              {/* Room structure - loads independently */}
              <Suspense fallback={null}>
                <Floor/>
                <Ceiling/>
                {/* Wall 1 - Back wall */}
                <Wall position={[0, 3.75, -10]} texturePath="/Wall_02.jpg" />
                {/* Wall 2 - Right wall */}
                <Wall position={[10, 3.75, 0]} rotation={[0, -Math.PI / 2, 0]} texturePath="/Wall_02.jpg" />  
                {/* Wall 3 - Front wall */}
                <Wall position={[0, 3.75, 10]} rotation={[0, Math.PI, 0]} texturePath="/Wall_02.jpg" />
                {/* Wall 4 - Left wall */}
                <Wall position={[-10, 3.75, 0]} rotation={[0, Math.PI / 2, 0]} texturePath="/Wall_02.jpg" />
              </Suspense>

              {/* Decorations - loads independently */}
              <Suspense fallback={null}>
                {/* Art Note - corner between Wall 1 (back) and Wall 2 (right) */}
                <ArtNote position={[9, 0, -9]} rotation={[0, -Math.PI/2, 0]} scale={0.03} />
                {/* Plant - corner between Wall 3 (front) and Wall 4 (left) */}
                <Plant position={[-9, 0, 9]} rotation={[0, -Math.PI / 4, 0]} scale={2} />
              </Suspense>

              {/* Artworks - each loads independently via GalleryArtwork's internal Suspense */}
              {artworks.map((artwork) => (
                <group key={artwork.id}>
                  <GalleryArtwork
                    art={artwork.art}
                    artistCard={artwork.artistCard}
                    artistCardPdf={artwork.artistCardPdf}
                    infoCard={artwork.infoCard}
                    infoCardPdf={artwork.infoCardPdf}
                    position={artwork.position}
                    rotation={artwork.rotation}
                    aspectRatio={artwork.aspectRatio}
                    displayWidth={artwork.displayWidth}
                    displayHeight={artwork.displayHeight}
                    onOpenOverlay={setOverlayImage}
                  />

                  <ProximityMessage
                    artPosition={artwork.position}
                    artRotation={artwork.rotation}
                    triggerDistance={7}
                    aspectRatio={artwork.aspectRatio}
                    displayWidth={artwork.displayWidth}
                    displayHeight={artwork.displayHeight}
                  />

                  <PurchasePanel 
                    artworkId={artwork.id}
                    artworkTitle={artwork.title}
                    artworkImage={artwork.art}
                    artPosition={artwork.position}
                    artRotation={artwork.rotation}
                    aspectRatio={artwork.aspectRatio}
                    displayWidth={artwork.displayWidth}
                    displayHeight={artwork.displayHeight}
                  />
                </group>
              ))}

              <Player />
              {/* PointerLockControls disabled - using click-and-drag instead */}
            </Canvas>
            <MobileControls/>
          </div>
          <FullscreenOverlay
            image={overlayImage}
            onClose={() => setOverlayImage(null)}
          />
          <GalleryFooter />
          <AssistancePanel visible={galleryReady} />
        </main>
      
    </PlayerProvider>
    </CartProvider>
  );
}