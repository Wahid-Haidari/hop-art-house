"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";




function Artwork() {
  const texture = useTexture("/art1.jpeg");

  return (
    <mesh position={[0, 1.5, -9.95]}>
      <planeGeometry args={[1.5, 2.5]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}


function ArtistCard() {
  const texture = useTexture("/artist1.jpeg"); // <- or your filename

  return (
    <mesh position={[1.2, 1.9, -9.9]}>
      <planeGeometry args={[0.5, 0.7]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function ArtInfoCard() {
  const texture = useTexture("/art1info.jpeg");

  return (
    <mesh position={[1.2, 1.1, -9.9]}>
      <planeGeometry args={[0.5, 0.7]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}


function Artwork2() {
  const texture = useTexture("/art2.jpg");

  return (
    <mesh position={[-9.9, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[1.5, 2.5]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function ArtistCard2() {
  const texture = useTexture("/artist2.jpg");  // update filename

  return (
    <mesh
      position={[-9.9, 1.9, -1.2]}   // same spacing as back wall, but along Z
      rotation={[0, Math.PI / 2, 0]} // same rotation as artwork2
    >
      <planeGeometry args={[0.5, 0.7]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function ArtInfoCard2() {
  const texture = useTexture("/art2info.jpg"); // update filename

  return (
    <mesh
      position={[-9.9, 1.1, -1.2]}   // same spacing pattern
      rotation={[0, Math.PI / 2, 0]}
    >
      <planeGeometry args={[0.5, 0.7]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}


// WASD movements __________________________________________________

type MovementKeys = "w" | "a" | "s" | "d";

function useKeyboard() {
  const keys = useRef<Record<MovementKeys, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if ((e.key as MovementKeys) in keys.current) {
        keys.current[e.key as MovementKeys] = true;
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if ((e.key as MovementKeys) in keys.current) {
        keys.current[e.key as MovementKeys] = false;
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keys;
}

function Player() {
  const { camera } = useThree();
  const keys = useKeyboard();

  useFrame(() => {
    const speed = 0.05; // walking speed

    if (keys.current.w) camera.position.z -= speed;
    if (keys.current.s) camera.position.z += speed;
    if (keys.current.a) camera.position.x -= speed;
    if (keys.current.d) camera.position.x += speed;
  });

  return null;
}






export default function Home() {
  return (
    <main className="w-full h-screen"> {/* It tells the browser: "This is the primary content of this page. */}

      <Canvas camera={{ position: [3, 3, 3] }}> {/*<Canvas> is the 3D scene container provided by React Three Fiber. */}
        {/* Light */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Floor -------------------------------------------------------------*/}
        {/* A mesh is a 3D object in the scene. */}
        <mesh  
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
        > {/* Rotate -90° around the X-axis (because -Math.PI/2 = -90°) */}
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#444" />
        </mesh>


        {/* Back Wall -------------------------------------------------------------*/}
        <mesh position={[0, 1, -10]}>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#888" />
        </mesh>


        {/* Left Wall -------------------------------------------------------------*/}
        <mesh position={[-10, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#777" />
        </mesh>


        {/* Right Wall -------------------------------------------------------------*/}
        <mesh position={[10, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#777" />
        </mesh>


        {/* Front Wall -------------------------------------------------------------*/}
        <mesh position={[0, 1, 10]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#888" />
        </mesh>



        {/* A simple cube -------------------------------------------------------*/}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Artwork Frame */}
        <Artwork />

        {/* Artist Info Card */}
        <ArtistCard />

        {/* Art Info Card */}
        <ArtInfoCard />


        <Artwork2 />
        <ArtistCard2 />
        <ArtInfoCard2 />

        <Player />
        <PointerLockControls /> {/* Allows you to look around with the mouse. */}







        

        
      </Canvas>

    </main>
  );
}
