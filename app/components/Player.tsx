

"use client";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";




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



// Player _______________________________________________________________________________
export default function Player() {
  const { camera } = useThree();
  const keys = useKeyboard();

  useFrame(() => {
    const speed = 0.05;

    // 1. Get the direction the camera is facing
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; 
    forward.normalize();

    // 2. Right direction (perpendicular)
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // 3. Proposed movement
    let nextX = camera.position.x;
    let nextZ = camera.position.z;

    if (keys.current.w) {
      nextX += forward.x * speed;
      nextZ += forward.z * speed;
    }
    if (keys.current.s) {
      nextX -= forward.x * speed;
      nextZ -= forward.z * speed;
    }
    if (keys.current.a) {
      nextX -= right.x * speed;
      nextZ -= right.z * speed;
    }
    if (keys.current.d) {
      nextX += right.x * speed;
      nextZ += right.z * speed;
    }

    // 4. Collisions
    const limit = 9.5;
    if (Math.abs(nextX) < limit) camera.position.x = nextX;
    if (Math.abs(nextZ) < limit) camera.position.z = nextZ;
  });

  return null;
}
