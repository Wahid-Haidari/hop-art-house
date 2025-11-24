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



export default function Home() {

  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  return (
    <main className="w-full h-screen"> {/* It tells the browser: "This is the primary content of this page. */}
      <ClickToStart>
        <Canvas camera={{ position: [3, 1.6, 3], fov: 30 }}> {/*<Canvas> is the 3D scene container provided by React Three Fiber. */}
          {/* Light */}
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} />

          {/* Floor -------------------------------------------------------------*/}
          {/* A mesh is a 3D object in the scene. */}
          <mesh  
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
          > {/* Rotate -90° around the X-axis (because -Math.PI/2 = -90°) */}
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#f5f5ff" />
          </mesh>


          {/* Back Wall -------------------------------------------------------------*/}
          <mesh position={[0, 1, -10]}>
            <planeGeometry args={[20, 4]} />
            <meshBasicMaterial color="white" />

          </mesh>


          {/* Left Wall -------------------------------------------------------------*/}
          <mesh position={[-10, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[20, 4]} />
            <meshBasicMaterial color="white" />
          </mesh>


          {/* Right Wall -------------------------------------------------------------*/}
          <mesh position={[10, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[20, 4]} />
            <meshBasicMaterial color="white" />
          </mesh>


          {/* Front Wall -------------------------------------------------------------*/}
          <mesh position={[0, 1, 10]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[20, 4]} />
            <meshBasicMaterial color="white" />
          </mesh>
 

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
          />  {/* new yellow bar */}

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
          <PointerLockControls /> {/* Allows you to look around with the mouse. */}        
        </Canvas>
      </ClickToStart>
      <Crosshair />
      <FullscreenOverlay
        image={overlayImage}
        onClose={() => setOverlayImage(null)}
      />



    </main>
  );
}
