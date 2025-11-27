export interface Size {
  label: string;
  dimensions: string;
  price: number;
}

export const SIZES: Size[] = [
  {
    label: "A3",
    dimensions: "11.7 × 16.5 in",
    price: 25,
  },
  {
    label: "A2",
    dimensions: "16.5 × 23.4 in",
    price: 60,
  },
  {
    label: "A1",
    dimensions: "23.4 × 33.1 in",
    price: 70,
  },
];