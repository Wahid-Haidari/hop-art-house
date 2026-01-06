"use client";

import { Canvas } from "@react-three/fiber";
import GalleryArtwork from "./components/GalleryArtwork";
import PurchasePanel from "./components/PurchasePanel";
import { useState, useCallback, useEffect } from "react"; 
import FullscreenOverlay from "./components/FullscreenOverlay";
import Wall from "./components/Wall";
import Floor from "./components/Floor";
import Ceiling from "./components/Ceiling";
import { PlayerProvider } from "./components/PlayerContext";
import ProximityMessage from "./components/ProximityMessage";
import Tree from "./components/Tree";
import ArtNote from "./components/ArtNote";
import Plant from "./components/Plant";
import { useArtworks } from "./hooks/useArtworks";
import LandingPage from "./components/LandingPage";
import { CartProvider } from "./components/CartContext";
import GalleryFooter from "./components/GalleryFooter";
import AssistancePanel from "./components/AssistancePanel";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";
import RotatePhone from "./components/RotatePhone";
import { useMobile } from "./hooks/useMobile";

export default function Home() {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showRotatePhone, setShowRotatePhone] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const isMobile = useMobile();
  const { artworks, isLoading } = useArtworks();

  const handleEnterFromLanding = () => {
    // Re-check mobile at the moment of entry
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    
    setShowLanding(false);
    // On mobile in portrait mode, show rotate phone screen
    if (mobile && window.innerHeight > window.innerWidth) {
      setShowRotatePhone(true);
    } else {
      // Start gallery fade in after a small delay
      setTimeout(() => setGalleryVisible(true), 50);
    }
  };

  const handleReturnToLanding = useCallback(() => {
    setGalleryVisible(false);
    setShowLanding(true);
    window.scrollTo(0, 0);
  }, []);

  const handleLandscape = useCallback(() => {
    setShowRotatePhone(false);
    // Start gallery fade in after a small delay
    setTimeout(() => setGalleryVisible(true), 50);
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

  // Keep yellow background until gallery is fully visible
  useEffect(() => {
    if (galleryVisible) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "0";
      document.body.style.left = "0";
      document.body.style.width = "100vw";
      document.body.style.height = "100vh";
      document.body.style.background = "#000";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.setProperty('background', '#000', 'important');
    } else {
      // Keep yellow background when landing is shown OR during transition to gallery
      document.body.style.overflow = showLanding ? "" : "hidden";
      document.body.style.position = showLanding ? "" : "fixed";
      document.body.style.top = showLanding ? "" : "0";
      document.body.style.left = showLanding ? "" : "0";
      document.body.style.width = showLanding ? "" : "100vw";
      document.body.style.height = showLanding ? "" : "100vh";
      document.body.style.background = "#F7C41A";
      document.documentElement.style.overflow = showLanding ? "" : "hidden";
      document.documentElement.style.setProperty('background', '#F7C41A', 'important');
    }
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
  }, [showLanding, galleryVisible]);

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
      {/* Gallery always renders (for preloading) but hidden when on landing/rotate screen */}
      <main style={{ 
        touchAction: "none", 
        position: "fixed", 
        top: 0, 
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        visibility: (showLanding || showRotatePhone) ? "hidden" : "visible",
        pointerEvents: (showLanding || showRotatePhone) ? "none" : "auto",
        opacity: galleryVisible ? 1 : 0,
        transition: "opacity 1000ms ease-in-out",
        background: "#000",
      }}>
        <div
          id="canvas-wrapper"
        >
            <Canvas 
              camera={{ position: [0, 3.6, 4], fov: 30 }}
              gl={{ 
                antialias: true,
                toneMapping: 0, // NoToneMapping
                outputColorSpace: 'srgb'
              }}
              onCreated={({ camera }) => {
                camera.lookAt(10, 3.6, 0);
              }}
            style={{ 
              pointerEvents: 'auto', 
              cursor: 'auto',
              display: 'block',
              }}
              onClick={(event) => {
                // Ensure clicks are processed with correct mouse coordinates
                event.stopPropagation?.();
              }}
            >
              {/* Lighting */}
              <ambientLight intensity={2} />
              <directionalLight position={[5, 10, 5]} intensity={1} />
              <directionalLight position={[-5, 10, -5]} intensity={0.5} />
              <pointLight position={[0, 6, 0]} intensity={0.5} />
              <Floor/>
              <Ceiling/>
              {/* <Tree position={[0, 0, 0]} scale={0.4} /> */}

              {/* Art Note - corner between Wall 1 (back) and Wall 2 (right) */}
              <ArtNote position={[9, 0, -9]} rotation={[0, -Math.PI/2, 0]} scale={0.03} />
              
              {/* Plant - corner between Wall 3 (front) and Wall 4 (left) */}
              <Plant position={[-9, 0, 9]} rotation={[0, -Math.PI / 4, 0]} scale={2} />

              {/* Walls */}
              {/* Wall 1 - Back wall */}
              <Wall position={[0, 3.75, -10]} texturePath="/Wall_01.jpg" />
              {/* Wall 2 - Right wall */}
              <Wall position={[10, 3.75, 0]} rotation={[0, -Math.PI / 2, 0]} texturePath="/Wall_02.jpg" />  
              {/* Wall 3 - Front wall */}
              <Wall position={[0, 3.75, 10]} rotation={[0, Math.PI, 0]} texturePath="/Wall_03.jpg" />
              {/* Wall 4 - Left wall */}
              <Wall position={[-10, 3.75, 0]} rotation={[0, Math.PI / 2, 0]} texturePath="/Wall_04.jpg" />

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
          <GalleryFooter onReturnToLanding={handleReturnToLanding} />
          <AssistancePanel visible={true} />
        </main>
      
    </PlayerProvider>
    </CartProvider>
  );
}