export interface ArtworkData {
  id: string;
  title: string;
  art: string;
  artistCard: string;        // Image displayed on wall
  artistCardPdf?: string | null;  // PDF to open on click (optional)
  infoCard: string;          // Image displayed on wall
  infoCardPdf?: string | null;    // PDF to open on click (optional)
  position: [number, number, number];
  rotation: [number, number, number];
  aspectRatio?: number;  // height/width ratio of the artwork image
  displayWidth?: number;  // Width in 3D units
  displayHeight?: number; // Height in 3D units
}

// Wall positions configuration
// Wall 1 = Back wall (First Wall in admin)
// Wall 2 = Right wall (Second Wall in admin) - clockwise
// Wall 3 = Front wall (Third Wall in admin) - clockwise
// Wall 4 = Left wall (Fourth Wall in admin) - clockwise

export const wallPositions = {
  // Wall 1: Back wall - 4 artworks (facing forward, rotation [0, 0, 0])
  first: [
    { position: [-6, 3.2, -9.95] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { position: [-2, 3.2, -9.95] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { position: [2, 3.2, -9.95] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { position: [6, 3.2, -9.95] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
  ],
  // Wall 2: Right wall - 4 artworks (facing left, rotation [0, -Math.PI / 2, 0])
  second: [
    { position: [9.95, 3.2, -6] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { position: [9.95, 3.2, -2] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { position: [9.95, 3.2, 2] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { position: [9.95, 3.2, 6] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
  ],
  // Wall 3: Front wall - 4 artworks (facing backward, rotation [0, Math.PI, 0])
  third: [
    { position: [6, 3.2, 9.95] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
    { position: [2, 3.2, 9.95] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
    { position: [-2, 3.2, 9.95] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
    { position: [-6, 3.2, 9.95] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
  ],
  // Wall 4: Left wall - 4 artworks (facing right, rotation [0, Math.PI / 2, 0])
  fourth: [
    { position: [-9.95, 3.2, 6] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { position: [-9.95, 3.2, 2] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { position: [-9.95, 3.2, -2] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { position: [-9.95, 3.2, -6] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
  ],
};