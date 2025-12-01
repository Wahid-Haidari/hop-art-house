"use client";

import { COLORS } from "../colors";

interface AboutPageProps {
  onClose: () => void;
  onNavigateToGetFeatured?: () => void;
  onNavigateToCart?: () => void;
}

export default function AboutPage({ onClose, onNavigateToGetFeatured, onNavigateToCart }: AboutPageProps) {
  return (
    <div 
      className="fixed inset-0 z-[3000] overflow-y-auto"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 text-black hover:opacity-70 cursor-pointer z-10"
        style={{
          fontSize: "28px",
          fontFamily: "var(--font-avant-garde-book)",
          background: "none",
          border: "none",
        }}
      >
        ✕
      </button>

      <div className="py-16" style={{ paddingLeft: "15%", paddingRight: "10%" }}>
        {/* First Section - Hop Art House */}
        <div 
          className="flex items-start gap-16 mb-24"
          style={{ maxWidth: "1200px" }}
        >
          {/* Left Content */}
          <div style={{ maxWidth: "600px" }}>
            {/* Title */}
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "var(--font-avant-garde-medium)",
                lineHeight: "100%",
                color: "black",
                marginBottom: "24px",
                letterSpacing: "2px",
              }}
            >
              HOP ART HOUSE
            </h1>

            {/* Subtitle */}
            <h2
              style={{
                fontSize: "24px",
                fontFamily: "var(--font-avant-garde-medium)",
                lineHeight: "130%",
                color: "black",
                marginBottom: "32px",
              }}
            >
              It's not the paint, the brush, or the code, it's the human pulse behind them.
            </h2>

            {/* First Paragraph */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                lineHeight: "170%",
                color: "black",
                marginBottom: "24px",
              }}
            >
              AI-generated images are the fast food for eyes; easy, cheap, and efficient but void of soul. They imitate creativity by averaging stolen works, producing visuals that are smooth, symmetrical, and lifeless. Like processed sugar, they please instantly but leave nothing lasting behind. True art is born from process and presence, a dialogue between artist and work, filled with uncertainty, care, and emotion. Machines can't feel wonder, nostalgia, or love; they can only simulate what humans once created.
            </p>

            {/* Second Paragraph */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                lineHeight: "170%",
                color: "black",
              }}
            >
              To honour that human spirit, I founded Hop Art, a curated art house celebrating digital works made by people, not algorithms. Each piece is crafted with intent and accompanied by a process video, proving that behind every artwork is a living hand and a thinking mind. In an automated age, Hop Art stands for the simple truth: art made by humans still holds warmth, depth, and wonder.
            </p>
          </div>

          {/* Right Image - Frog Illustration */}
          <div 
            className="flex-shrink-0"
            style={{ width: "350px", height: "350px" }}
          >
            {/* Add Frog Illustration.svg to public folder */}
            <img
              src="/Frog Logo.svg"
              alt="Hop Art House Frog"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Second Section - Hamid Mubariz */}
        <div 
          className="flex items-start gap-16 mb-24"
          style={{ maxWidth: "1200px" }}
        >
          {/* Left Content */}
          <div style={{ maxWidth: "600px" }}>
            {/* Title */}
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "var(--font-avant-garde-medium)",
                lineHeight: "100%",
                color: "black",
                marginBottom: "24px",
                letterSpacing: "2px",
              }}
            >
              HAMID MUBARIZ
            </h1>

            {/* First Paragraph */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                lineHeight: "170%",
                color: "black",
                marginBottom: "24px",
              }}
            >
              I was born and raised in Afghanistan, and I've loved art for as long as I can remember. I still have drawings from when I was seven. At 17, I moved to Japan to attend UWC ISAK, where I studied Fine Art and met Grace, my classmate and now cofounder of Hop Art Club.
            </p>

            {/* Second Paragraph */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                lineHeight: "170%",
                color: "black",
              }}
            >
              Later, I studied Graphic Design, Fine Art, and the Business of Art and Design at Ringling College in the U.S. When the visa program I was on was canceled under the Trump administration, I had to leave. I came to Canada, sought asylum, and now live here as a refugee still making, still creating, still believing in the power of human-made art.
            </p>
          </div>

          {/* Right Image - Hamid Photo */}
          <div 
            className="flex-shrink-0"
            style={{ width: "300px", height: "380px" }}
          >
            <img
              src="/hamid.jpg"
              alt="Hamid Mubariz"
              className="w-full h-full object-cover"
              style={{ border: "4px solid black" }}
            />
          </div>
        </div>

        {/* Third Section - Grace Sun */}
        <div 
          className="flex items-start gap-16 mb-16"
          style={{ maxWidth: "1200px" }}
        >
          {/* Left Content */}
          <div style={{ maxWidth: "600px" }}>
            {/* Title */}
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "var(--font-avant-garde-medium)",
                lineHeight: "100%",
                color: "black",
                marginBottom: "24px",
                letterSpacing: "2px",
              }}
            >
              GRACE SUN
            </h1>

            {/* First Paragraph */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                lineHeight: "170%",
                color: "black",
                marginBottom: "24px",
              }}
            >
              I was born and raised in Afghanistan, and I've loved art for as long as I can remember. I still have drawings from when I was seven. At 17, I moved to Japan to attend UWC ISAK, where I studied Fine Art and met Grace, my classmate and now cofounder of Hop Art Club.
            </p>

            {/* Second Paragraph */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                lineHeight: "170%",
                color: "black",
              }}
            >
              Later, I studied Graphic Design, Fine Art, and the Business of Art and Design at Ringling College in the U.S. When the visa program I was on was canceled under the Trump administration, I had to leave. I came to Canada, sought asylum, and now live here as a refugee still making, still creating, still believing in the power of human-made art.
            </p>
          </div>

          {/* Right Image - Grace Photo */}
          <div 
            className="flex-shrink-0"
            style={{ width: "300px", height: "380px" }}
          >
            <img
              src="/grace.jpg"
              alt="Grace Sun"
              className="w-full h-full object-cover"
              style={{ border: "4px solid black" }}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-24">
          {/* Black Horizontal Line */}
          <div 
            style={{ 
              width: "100vw", 
              height: "2px", 
              backgroundColor: "black",
              marginBottom: "60px",
              marginLeft: "-15vw",
            }} 
          />

          {/* Footer Content */}
          <div 
            className="flex items-center justify-center gap-32"
            style={{ paddingBottom: "60px" }}
          >
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              {/* Frog Logo */}
              <div style={{ width: "120px", height: "120px" }}>
                <img
                  src="/Frog Logo.svg"
                  alt="Hop Art House Frog"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Text Logo */}
              <div>
                <h3
                  style={{
                    fontSize: "28px",
                    fontFamily: "var(--font-avant-garde-medium)",
                    lineHeight: "100%",
                    color: "black",
                    marginBottom: "4px",
                  }}
                >
                  HOP
                </h3>
                <h3
                  style={{
                    fontSize: "28px",
                    fontFamily: "var(--font-avant-garde-medium)",
                    lineHeight: "100%",
                    color: "black",
                    marginBottom: "4px",
                  }}
                >
                  ART
                </h3>
                <h3
                  style={{
                    fontSize: "28px",
                    fontFamily: "var(--font-avant-garde-medium)",
                    lineHeight: "100%",
                    color: "black",
                    marginBottom: "4px",
                  }}
                >
                  HOUSE
                </h3>
                <p
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-avant-garde-book)",
                    letterSpacing: "2px",
                    color: "black",
                  }}
                >
                  EXPRESS & INSPIRE
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-4">
              <span
                onClick={onClose}
                className="cursor-pointer hover:opacity-70"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-avant-garde-book)",
                  color: "black",
                }}
              >
                Home
              </span>
              <a
                href="#order"
                className="hover:opacity-70"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-avant-garde-book)",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Order
              </a>
              <a
                href="#faq"
                className="hover:opacity-70"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-avant-garde-book)",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                FAQ
              </a>
              <a
                href="mailto:Hi@HopArt.House"
                className="hover:opacity-70"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-avant-garde-book)",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Bottom Left: Frog Logo */}
      <div 
        className="fixed z-[3010] pointer-events-auto"
        style={{
          width: "45px",
          height: "43px",
          bottom: "20px",
          left: "28px",
        }}
      >
        <img
          src="/Frog Logo.svg"
          className="w-full h-full"
          alt="Hop Art House"
        />
      </div>

      {/* Footer - Bottom Right: Navigation */}
      <div 
        className="fixed z-[3010] pointer-events-auto flex items-center"
        style={{
          bottom: "24px",
          right: "30px",
          gap: "36px",
        }}
      >
        <span 
          onClick={onClose}
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Art House
        </span>
        <span 
          className="text-black no-underline cursor-default"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
        >
          About
        </span>
        <span 
          onClick={onNavigateToGetFeatured}
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Get Featured
        </span>
        <a 
          href="mailto:Hi@HopArt.House" 
          className="text-black no-underline hover:opacity-70 cursor-pointer"
          style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
        >
          Contact
        </a>
        <div 
          onClick={onNavigateToCart}
          className="flex items-center cursor-pointer hover:opacity-70"
          style={{ width: "32px", height: "27px" }}
        >
          <img
            src="/Cart.svg"
            className="w-full h-full"
            alt="cart"
          />
        </div>
      </div>
    </div>
  );
}
