"use client";

import { useState } from "react";

export default function ClickToStart({
  children,
}: {
  children: React.ReactNode;
}) {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started && (
        <div
          onClick={() => setStarted(true)}
          className="
            fixed inset-0 
            bg-black/70 
            text-white 
            flex 
            items-center 
            justify-center 
            cursor-pointer 
            text-2xl 
            z-50
          "
        >
          Click to Enter Gallery
        </div>
      )}

      {started && children}
    </>
  );
}
