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
  {
    id: "artwork-1",
    title: "Artwork 1",
    art: "/Tigress.jpg",
    artistCard: "/Artist Bio.jpg",
    infoCard: "/Art Label.jpg",
    position: [0, 2.5, -9.95],
    rotation: [0, 0, 0],
  },
  {
    id: "artwork-2",
    title: "Artwork 2",
    art: "/art2.jpg",
    artistCard: "/artist2.jpg",
    infoCard: "/art2info.jpg",
    position: [-9.9, 2.5, 0],
    rotation: [0, Math.PI / 2, 0],
  },
];