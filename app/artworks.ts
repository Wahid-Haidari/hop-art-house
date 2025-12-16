export interface ArtworkData {
  id: string;
  title: string;
  art: string;
  artistCard: string;
  infoCard: string;
  position: [number, number, number];
  rotation: [number, number, number];
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

// Default placeholder image
const PLACEHOLDER_ART = "/Tigress.jpg";
const PLACEHOLDER_ARTIST_CARD = "/Artist Bio.jpg";
const PLACEHOLDER_INFO_CARD = "/Art Label.jpg";

// Default artworks (fallback when no admin config is loaded)
export const defaultArtworks: ArtworkData[] = [
  // Back wall (Wall 1)
  ...wallPositions.first.map((pos, i) => ({
    id: `first-${i + 1}`,
    title: `Artwork ${i + 1}`,
    art: PLACEHOLDER_ART,
    artistCard: PLACEHOLDER_ARTIST_CARD,
    infoCard: PLACEHOLDER_INFO_CARD,
    position: pos.position,
    rotation: pos.rotation,
  })),
  // Right wall (Wall 2)
  ...wallPositions.second.map((pos, i) => ({
    id: `second-${i + 1}`,
    title: `Artwork ${i + 5}`,
    art: PLACEHOLDER_ART,
    artistCard: PLACEHOLDER_ARTIST_CARD,
    infoCard: PLACEHOLDER_INFO_CARD,
    position: pos.position,
    rotation: pos.rotation,
  })),
  // Front wall (Wall 3)
  ...wallPositions.third.map((pos, i) => ({
    id: `third-${i + 1}`,
    title: `Artwork ${i + 9}`,
    art: PLACEHOLDER_ART,
    artistCard: PLACEHOLDER_ARTIST_CARD,
    infoCard: PLACEHOLDER_INFO_CARD,
    position: pos.position,
    rotation: pos.rotation,
  })),
  // Left wall (Wall 4)
  ...wallPositions.fourth.map((pos, i) => ({
    id: `fourth-${i + 1}`,
    title: `Artwork ${i + 13}`,
    art: PLACEHOLDER_ART,
    artistCard: PLACEHOLDER_ARTIST_CARD,
    infoCard: PLACEHOLDER_INFO_CARD,
    position: pos.position,
    rotation: pos.rotation,
  })),
];

// Keep the old export for backward compatibility
export const artworks = defaultArtworks;