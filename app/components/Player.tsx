"use client";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerPosition } from "./PlayerContext";

// Mobile detection
function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

export default function MobilePlayer() {
  const { camera, gl } = useThree();
  const { setPosition } = usePlayerPosition();
  const [isMobile, setIsMobile] = useState(false);
  
  // Desktop keyboard state
  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    " ": false,
    Shift: false,
  });

  // Desktop drag-to-look state
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const cameraRotationRef = useRef({ yaw: 0, pitch: 0 });

  // Mobile movement state
  const mobileMovementRef = useRef({ forward: 0, right: 0, up: 0 });
  const mobileLookRef = useRef({ yaw: 0, pitch: 0 });
  const touchLookRef = useRef<{ x: number; y: number } | null>(null);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop click-and-drag look controls
  useEffect(() => {
    if (isMobile) return;

    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;

      // Calculate exact sensitivity to make cursor stick to world point
      // For a perspective camera, the relationship between pixels and radians is:
      // radians = pixels * (FOV / screenHeight) for vertical
      // For horizontal, we need to account for aspect ratio
      const fovRad = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
      const height = canvas.clientHeight;
      const width = canvas.clientWidth;
      
      // Vertical: FOV covers the full height
      const sensitivityY = fovRad / height;
      
      // Horizontal: Use the horizontal FOV
      // horizontalFOV = 2 * atan(tan(verticalFOV/2) * aspectRatio)
      const aspectRatio = width / height;
      const hFovRad = 2 * Math.atan(Math.tan(fovRad / 2) * aspectRatio);
      const sensitivityX = hFovRad / width;

      // Update yaw (horizontal rotation) - inverted so dragging right moves scene right
      cameraRotationRef.current.yaw += deltaX * sensitivityX;

      // Update pitch (vertical rotation) - inverted so dragging down moves scene down
      cameraRotationRef.current.pitch += deltaY * sensitivityY;
      cameraRotationRef.current.pitch = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, cameraRotationRef.current.pitch)
      );

      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    // Set initial cursor style
    canvas.style.cursor = "grab";

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, gl, camera]);

  // Desktop keyboard controls
  // Desktop keyboard controls
  useEffect(() => {
    if (isMobile) return;

    const downHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        keysRef.current[key] = true;
      } else if (e.key === " ") {
        keysRef.current[" "] = true;
      } else if (e.key === "Shift") {
        keysRef.current.Shift = true;
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        keysRef.current[key] = false;
      } else if (e.key === " ") {
        keysRef.current[" "] = false;
      } else if (e.key === "Shift") {
        keysRef.current.Shift = false;
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [isMobile]);
















  // Mobile touch controls
  useEffect(() => {
    if (!isMobile) return;

    // Joystick movement handler
    const handleJoystickMove = (e: CustomEvent) => {
      mobileMovementRef.current = {
        forward: e.detail.forward,
        right: e.detail.right,
        up: 0,
      };
    };

    // Look control handler
    const handleLookMove = (e: CustomEvent) => {
      mobileLookRef.current.yaw += e.detail.x;
      mobileLookRef.current.pitch += e.detail.y;
      mobileLookRef.current.pitch = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, mobileLookRef.current.pitch)
      );
    };

    // Up/Down button handlers
    const handleUpButton = () => {
      mobileMovementRef.current.up = 1;
    };

    const handleDownButton = () => {
      mobileMovementRef.current.up = -1;
    };

    const handleButtonRelease = () => {
      mobileMovementRef.current.up = 0;
    };

    window.addEventListener("joystick-move", handleJoystickMove as EventListener);
    window.addEventListener("look-move", handleLookMove as EventListener);
    window.addEventListener("up-button", handleUpButton);
    window.addEventListener("down-button", handleDownButton);
    window.addEventListener("button-release", handleButtonRelease);

    return () => {
      window.removeEventListener("joystick-move", handleJoystickMove as EventListener);
      window.removeEventListener("look-move", handleLookMove as EventListener);
      window.removeEventListener("up-button", handleUpButton);
      window.removeEventListener("down-button", handleDownButton);
      window.removeEventListener("button-release", handleButtonRelease);
    };
  }, [isMobile]);

  // Movement and camera update
  useFrame(() => {
    const speed = 0.05;

    if (isMobile) {
      // Mobile controls
      const { forward, right, up } = mobileMovementRef.current;
      const { yaw, pitch } = mobileLookRef.current;

      // Update camera rotation
      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;

      // Get forward and right vectors
      const forwardDir = new THREE.Vector3();
      camera.getWorldDirection(forwardDir);
      forwardDir.y = 0;
      forwardDir.normalize();

      const rightDir = new THREE.Vector3();
      rightDir.crossVectors(forwardDir, camera.up).normalize();

      // Apply movement
      let nextX = camera.position.x;
      let nextY = camera.position.y;
      let nextZ = camera.position.z;

      nextX += forwardDir.x * forward * speed;
      nextZ += forwardDir.z * forward * speed;
      nextX += rightDir.x * right * speed;
      nextZ += rightDir.z * right * speed;
      nextY += up * speed;

      // Collision detection
      const limit = 9.5;
      const minY = 1;
      const maxY = 100;

      if (Math.abs(nextX) < limit) camera.position.x = nextX;
      if (Math.abs(nextZ) < limit) camera.position.z = nextZ;
      if (nextY > minY && nextY < maxY) camera.position.y = nextY;
    } else {
      // Desktop: Apply camera rotation from drag
      camera.rotation.order = "YXZ";
      camera.rotation.y = cameraRotationRef.current.yaw;
      camera.rotation.x = cameraRotationRef.current.pitch;

      // Desktop keyboard controls
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up).normalize();

      let nextX = camera.position.x;
      let nextZ = camera.position.z;

      if (keysRef.current.w) {
        nextX += forward.x * speed;
        nextZ += forward.z * speed;
      }
      if (keysRef.current.s) {
        nextX -= forward.x * speed;
        nextZ -= forward.z * speed;
      }
      if (keysRef.current.a) {
        nextX -= right.x * speed;
        nextZ -= right.z * speed;
      }
      if (keysRef.current.d) {
        nextX += right.x * speed;
        nextZ += right.z * speed;
      }

      // Collision for horizontal
      const limit = 9.5;
      if (Math.abs(nextX) < limit) camera.position.x = nextX;
      if (Math.abs(nextZ) < limit) camera.position.z = nextZ;

      // Vertical movement
      let nextY = camera.position.y;

      if (keysRef.current[" "]) {
        nextY += speed;
      }
      if (keysRef.current.Shift) {
        nextY -= speed;
      }

      // Collision for vertical
      const minY = 1;
      const maxY = 100;

      if (nextY > minY && nextY < maxY) {
        camera.position.y = nextY;
      }
    }

    // Update position in context
    setPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  return null;
}