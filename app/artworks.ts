export interface ArtworkData {
  id: string;
  title: string;
  art: string;
  artistCard: string;
  infoCard: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const artworks: ArtworkData[] = [
  // Back wall - 4 artworks (facing forward, rotation [0, 0, 0])
  {
    id: "back-1",
    title: "Artwork 1",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [-6, 3.2, -9.95],
    rotation: [0, 0, 0],
  },
  {
    id: "back-2",
    title: "Artwork 2",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [-2, 3.2, -9.95],
    rotation: [0, 0, 0],
  },
  {
    id: "back-3",
    title: "Artwork 3",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [2, 3.2, -9.95],
    rotation: [0, 0, 0],
  },
  {
    id: "back-4",
    title: "Artwork 4",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [6, 3.2, -9.95],
    rotation: [0, 0, 0],
  },
  // Left wall - 4 artworks (facing right, rotation [0, Math.PI / 2, 0])
  {
    id: "left-1",
    title: "Artwork 5",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [-9.95, 3.2, -6],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "left-2",
    title: "Artwork 6",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [-9.95, 3.2, -2],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "left-3",
    title: "Artwork 7",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [-9.95, 3.2, 2],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "left-4",
    title: "Artwork 8",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [-9.95, 3.2, 6],
    rotation: [0, Math.PI / 2, 0],
  },
  // Right wall - 4 artworks (facing left, rotation [0, -Math.PI / 2, 0])
  {
    id: "right-1",
    title: "Artwork 9",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [9.95, 3.2, -6],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: "right-2",
    title: "Artwork 10",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [9.95, 3.2, -2],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: "right-3",
    title: "Artwork 11",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [9.95, 3.2, 2],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: "right-4",
    title: "Artwork 12",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [9.95, 3.2, 6],
    rotation: [0, -Math.PI / 2, 0],
  },
];