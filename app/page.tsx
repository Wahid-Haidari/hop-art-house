"use client";

import { Canvas } from "@react-three/fiber";
import GalleryArtwork from "./components/GalleryArtwork";
import PurchasePanel from "./components/PurchasePanel";
import { useState, useCallback, useEffect, Suspense } from "react"; 
import FullscreenOverlay from "./components/FullscreenOverlay";
import Wall from "./components/Wall";
import Floor from "./components/Floor";
import Ceiling from "./components/Ceiling";
import { PlayerProvider } from "./components/PlayerContext";
import ProximityMessage from "./components/ProximityMessage";
import Tree from "./components/Tree";
import { useArtworks } from "./hooks/useArtworks";
import LandingPage from "./components/LandingPage";
import { CartProvider } from "./components/CartContext";
import GalleryFooter from "./components/GalleryFooter";
import AssistancePanel from "./components/AssistancePanel";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";
import RotatePhone from "./components/RotatePhone";
import { useMobile } from "./hooks/useMobile";
import { useSearchParams } from "next/navigation";
import EditModeOverlay from "./components/EditModeOverlay";

function HomeContent() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showRotatePhone, setShowRotatePhone] = useState(false);
  const isMobile = useMobile();
  const { artworks, isLoading, refetch } = useArtworks();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  // In edit mode, skip landing page
  useEffect(() => {
    if (isEditMode) {
      setShowLanding(false);
    }
  }, [isEditMode]);

  const handleEnterFromLanding = () => {
    // Re-check mobile at the moment of entry
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    
    setShowLanding(false);
    // On mobile in portrait mode, show rotate phone screen
    if (mobile && window.innerHeight > window.innerWidth) {
      setShowRotatePhone(true);
    }
  };

  const handleReturnToLanding = useCallback(() => {
    setShowLanding(true);
    window.scrollTo(0, 0);
  }, []);

  const handleLandscape = useCallback(() => {
    setShowRotatePhone(false);
  }, []);

  // Desktop: scroll up to return to landing page
  useEffect(() => {
    if (isMobile || showLanding) return;

    const handleWheel = (e: WheelEvent) => {
      // Only trigger on scroll up (negative deltaY)
      if (e.deltaY < -50) {
        handleReturnToLanding();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isMobile, showLanding, handleReturnToLanding]);

  return (
    <CartProvider>
      <PlayerProvider>
      {showLanding && (
        <>
          <LandingPage onEnter={handleEnterFromLanding} />
          {/* Spacer to enable scrolling */}
          <div className="h-[200vh]" />
        </>
      )}
      {showRotatePhone && (
        <RotatePhone onLandscape={handleLandscape} />
      )}
      <main className="w-full h-screen" style={{ touchAction: "none" }}>
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
                    artistCardPdf={artwork.artistCardPdf}
                    infoCard={artwork.infoCard}
                    infoCardPdf={artwork.infoCardPdf}
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
              {/* PointerLockControls disabled - using click-and-drag instead */}
            </Canvas>
            {!showLanding && !showRotatePhone && <MobileControls/>}
          </div>
        <FullscreenOverlay
          image={overlayImage}
          onClose={() => setOverlayImage(null)}
        />
        {!showLanding && !isEditMode && <GalleryFooter onReturnToLanding={handleReturnToLanding} />}
        {!showLanding && !isEditMode && <AssistancePanel visible={!showLanding} />}
        {isEditMode && (
          <EditModeOverlay
            artworks={artworks}
            onDimensionChange={() => refetch()}
            onExit={() => window.location.href = "/"}
          />
        )}
      </main>
      
    </PlayerProvider>
    </CartProvider>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#E8E4EC", minHeight: "100vh" }} />}>
      <HomeContent />
    </Suspense>
  );
}