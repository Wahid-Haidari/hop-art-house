"use client";

import { useEffect, useRef, useState } from "react";
import { useMobile } from "../hooks/useMobile";
import { useCart } from "./CartContext";

interface AboutPageProps {
  onClose: () => void;
  onNavigateToGetFeatured?: () => void;
  onNavigateToCart?: () => void;
}

interface Founder {
  name: string;
  role: string;
  mobileRole?: string;
  image: string;
  alt: string;
  objectPosition: string;
  paragraphs: string[];
}

const founders: Founder[] = [
  {
    name: "HAMID MUBARIZ",
    role: "Creative Director",
    image: "/founders/Hamid.png",
    alt: "Hamid Mubariz",
    objectPosition: "center center",
    paragraphs: [
      "I was born and raised in Afghanistan, and I've loved art for as long as I can remember. I still have drawings from when I was seven. At 17, I moved to Japan to attend UWC ISAK, where I studied Fine Art and met Grace, my classmate and now cofounder of Hop Art House.",
      "Later, I studied Graphic Design, Fine Art, and the Business of Art and Design at Ringling College in the U.S. When the visa program I was on was canceled under the Trump administration, I had to leave. I came to Canada, sought asylum, and now live here as a refugee still making, still creating, still believing in the power of human-made art.",
    ],
  },
  {
    name: "WAHID HAIDARI",
    role: "Technical Director",
    mobileRole: "Technology Director",
    image: "/founders/Wahid.png",
    alt: "Wahid Haidari",
    objectPosition: "center center",
    paragraphs: [
      "I was born and raised in Afghanistan and grew up in a household with two brothers who are artists. As a child, I spent a lot of time drawing with pencil and watercolor, which shaped my early appreciation for art and visual expression. I later moved to Japan for high school, then to the US for my bachelor's degree in Computer Science. I am currently pursuing a Master's in Management of Information Technology.",
      "I am interested in using technology to design practical, human-centered solutions that solve real problems. While my professional path is rooted in technology, I always appreciate art.",
    ],
  },
  {
    name: "GRACE SUN",
    role: "Business Director",
    image: "/founders/Grace.png",
    alt: "Grace Sun",
    objectPosition: "center center",
    paragraphs: [
      "I was born and raised in Taipei, and later lived in Shanghai, Japan, France, and Canada. Moving between places shaped my awareness of culture, people, and how creative ideas shift across contexts.",
      "I studied art during my early schooling, and creativity has remained part of my life ever since. I'm drawn to design, film, photography, and visual storytelling, with a focus on the human process behind making, the choices, imperfections, and intent that machines can't replicate.",
      "Hop Art House was founded on the belief that art isn't defined by speed or polish, but by presence. I'm building a space dedicated to work made by people, not algorithms, at a time when that distinction matters more than ever.",
    ],
  },
];

function FounderPanel({ founder, isMobile }: { founder: Founder; isMobile: boolean }) {
  if (isMobile) {
    return (
      <section style={{ backgroundColor: "#F7C41A" }}>
        <div
          className="about-mobile-founder-image relative w-full overflow-hidden"
          style={{
            backgroundColor: "#050505",
          }}
        >
          <img
            src={founder.image}
            alt={founder.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: founder.objectPosition }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.34) 44%, rgba(0,0,0,0) 82%)",
            }}
          />
          <div
            className="absolute text-white"
            style={{
              left: "30px",
              bottom: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-avant-garde-book)",
                fontSize: "23px",
                lineHeight: "1",
                letterSpacing: "0",
              }}
            >
              {founder.name}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-avant-garde-book)",
                fontSize: "16px",
                lineHeight: "1.08",
              }}
            >
              {founder.mobileRole ?? founder.role}
            </p>
          </div>
        </div>

        <div
          className="about-mobile-founder-copy"
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {founder.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                color: "#000",
                fontFamily: "var(--font-avant-garde-book)",
                fontSize: "15px",
                lineHeight: "1.05",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "clamp(560px, 44.4vw, 680px)",
        backgroundColor: "#020202",
      }}
    >
      <img
        src={founder.image}
        alt={founder.alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: founder.objectPosition }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,.98) 0%, rgba(0,0,0,.86) 34%, rgba(0,0,0,.36) 56%, rgba(0,0,0,0) 76%)",
        }}
      />

      <div
        className="relative z-10 flex h-full flex-col justify-start text-white"
        style={{
          width: "min(43vw, 620px)",
          paddingTop: "clamp(68px, 5.9vw, 92px)",
          marginLeft: "7.5vw",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-avant-garde-book)",
            fontSize: "clamp(52px, 4.8vw, 74px)",
            lineHeight: "0.98",
            letterSpacing: "0",
            marginBottom: "2px",
          }}
        >
          {founder.name}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-avant-garde-book)",
            fontSize: "clamp(30px, 2.7vw, 44px)",
            lineHeight: "1.05",
            marginBottom: "clamp(24px, 2vw, 34px)",
          }}
        >
          {founder.role}
        </p>

        <div
          style={{
            display: "grid",
            gap: "26px",
          }}
        >
          {founder.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                fontFamily: "var(--font-avant-garde-book)",
                fontSize: "clamp(18px, 1.45vw, 22px)",
                lineHeight: "1.13",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileIntro({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="about-mobile-intro"
      style={{
        backgroundColor: "#F7C41A",
        color: "#000",
      }}
    >
      <header className="flex items-start justify-between">
        <button
          type="button"
          onClick={onClose}
          aria-label="Return to Art House"
          style={{
            width: "45px",
            height: "43px",
            cursor: "pointer",
            padding: 0,
            border: 0,
            background: "transparent",
          }}
        >
          <img src="/Frog Logo.svg" className="h-full w-full" alt="" />
        </button>
      </header>

      <div style={{ marginTop: "48px" }}>
        <h1
          style={{
            fontFamily: "var(--font-avant-garde-medium)",
            fontSize: "26px",
            lineHeight: "1",
            letterSpacing: "0",
            marginBottom: "20px",
          }}
        >
          HOP ART HOUSE
        </h1>

        <div style={{ display: "grid", gap: "18px" }}>
          <p
            style={{
              fontFamily: "var(--font-avant-garde-book)",
              fontSize: "14px",
              lineHeight: "1.08",
            }}
          >
            Hop Art House is dedicated to human-made art, honouring the artist's hand, creative process, and emotional presence. While AI has its place in science and technology, art is fundamentally human. It is born from intentionality, uncertainty, and individuality; qualities no machine can replicate.
          </p>
          <p
            style={{
              fontFamily: "var(--font-avant-garde-book)",
              fontSize: "14px",
              lineHeight: "1.08",
            }}
          >
            In a world flooded with noise, we stand for meaning and intention. We collaborate closely with artists to publish high-quality physical editions of digital works. The pieces include a link to the artist's process, affirming authorship and revealing the humanity behind the art.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage({ onClose, onNavigateToGetFeatured, onNavigateToCart }: AboutPageProps) {
  const { getTotalItems } = useCart();
  const isMobile = useMobile();
  const pageBackground = isMobile ? "#F7C41A" : "#000";
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalStyles = {
      bodyHeight: document.body.style.height,
      bodyBg: document.body.style.background,
      bodyPosition: document.body.style.position,
      bodyOverflow: document.body.style.overflow,
      bodyWidth: document.body.style.width,
      bodyLeft: document.body.style.left,
      bodyRight: document.body.style.right,
      htmlBg: document.documentElement.style.background,
      htmlOverflow: document.documentElement.style.overflow,
    };

    document.body.style.height = "auto";
    document.body.style.position = "static";
    document.body.style.overflow = "auto";
    document.body.style.width = "100vw";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.background = pageBackground;
    document.documentElement.style.setProperty("background", pageBackground, "important");
    document.documentElement.style.overflow = "auto";

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = metaThemeColor?.getAttribute("content") || "";
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", pageBackground);
    }

    return () => {
      document.body.style.height = originalStyles.bodyHeight;
      document.body.style.position = originalStyles.bodyPosition;
      document.body.style.overflow = originalStyles.bodyOverflow;
      document.body.style.width = originalStyles.bodyWidth;
      document.body.style.left = originalStyles.bodyLeft;
      document.body.style.right = originalStyles.bodyRight;
      document.body.style.background = originalStyles.bodyBg;
      document.documentElement.style.setProperty("background", originalStyles.htmlBg || "#000", "important");
      document.documentElement.style.overflow = originalStyles.htmlOverflow;
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", originalThemeColor);
      }
    };
  }, [pageBackground]);

  useEffect(() => {
    if (!isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 z-[3000] overflow-y-auto"
      style={{
        backgroundColor: pageBackground,
        width: "100vw",
        height: "100%",
      }}
      onWheel={handleWheel}
    >
      {isMobile && (
        <style>
          {`
            .about-mobile-intro {
              min-height: 442px;
              padding: 18px 30px 42px;
            }

            .about-mobile-founder-image {
              height: 188px;
            }

            .about-mobile-founder-copy {
              padding: 20px 30px 50px;
            }

            @media (orientation: landscape) {
              .about-mobile-intro {
                min-height: auto;
                padding-bottom: 32px;
              }

              .about-mobile-founder-image {
                height: min(46vw, 330px);
              }

              .about-mobile-founder-copy {
                padding: 16px 30px 26px;
              }
            }
          `}
        </style>
      )}

      <main>
        {isMobile && <MobileIntro onClose={onClose} />}
        {founders.map((founder) => (
          <FounderPanel key={founder.name} founder={founder} isMobile={isMobile} />
        ))}
      </main>

      {isMobile && (
        <div
          className="fixed z-[3010] pointer-events-auto flex items-center"
          style={{
            top: headerVisible ? "20px" : "-60px",
            right: "20px",
            gap: "16px",
            transition: "top 0.3s ease-in-out",
          }}
        >
          <div onClick={onNavigateToCart} className="cursor-pointer hover:opacity-70" style={{ position: "relative" }}>
            <img
              src="/Cart.svg"
              style={{ width: "32px", height: "27px" }}
              alt="cart"
            />
            {getTotalItems() > 0 && (
              <span
                className="absolute flex items-center justify-center"
                style={{
                  top: "calc(50% - 1px)",
                  left: "calc(50% + 5px)",
                  transform: "translate(-50%, -50%)",
                  fontSize: "12px",
                  lineHeight: "100%",
                  fontFamily: "var(--font-avant-garde-book)",
                  color: "white",
                }}
              >
                {getTotalItems()}
              </span>
            )}
          </div>

          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer flex flex-col justify-center items-center"
            style={{ width: "30px", height: "30px", gap: "5px" }}
          >
            <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
            <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
            <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
          </div>
        </div>
      )}

      {isMobile && menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[3020] pointer-events-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="fixed z-[3030] pointer-events-auto bg-white"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              width: "60%",
              maxWidth: "300px",
              padding: "24px",
              borderLeft: "1px solid #e0e0e0",
            }}
          >
            <div className="flex justify-end mb-8">
              <div onClick={() => setMenuOpen(false)} className="cursor-pointer" style={{ fontSize: "28px", lineHeight: "1" }}>
                x
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: "24px" }}>
              <span
                onClick={() => {
                  onClose();
                  setMenuOpen(false);
                }}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                Art House
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <span
                className="text-black no-underline cursor-default"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
              >
                About
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <span
                onClick={() => {
                  onNavigateToGetFeatured?.();
                  setMenuOpen(false);
                }}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                Get Featured
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <a
                href="mailto:Hi@HopArt.House"
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        </>
      )}

      {!isMobile && (
        <div
          className="fixed z-[3010] pointer-events-auto"
          style={{
            width: "45px",
            height: "43px",
            bottom: "20px",
            left: "28px",
            filter: "invert(1)",
          }}
        >
          <img src="/Frog Logo.svg" className="w-full h-full" alt="Hop Art House" />
        </div>
      )}

      {!isMobile && (
        <div
          className="fixed z-[3010] pointer-events-auto flex items-center"
          style={{
            bottom: "20px",
            right: "30px",
            gap: "36px",
          }}
        >
          <span
            onClick={onClose}
            className="text-white no-underline hover:opacity-70 cursor-pointer"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
          >
            Art House
          </span>
          <span
            className="text-white no-underline cursor-default"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
          >
            About
          </span>
          <span
            onClick={onNavigateToGetFeatured}
            className="text-white no-underline hover:opacity-70 cursor-pointer"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
          >
            Get Featured
          </span>
          <a
            href="mailto:Hi@HopArt.House"
            className="text-white no-underline hover:opacity-70 cursor-pointer"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
          >
            Contact
          </a>
          <div
            onClick={onNavigateToCart}
            className="flex flex-col items-center cursor-pointer hover:opacity-70"
            style={{ gap: "0px", position: "relative", top: "-4px" }}
          >
            {getTotalItems() > 0 && (
              <span
                className="text-black"
                style={{ fontSize: "12px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                {getTotalItems()}
              </span>
            )}
            <img src="/Cart.svg" style={{ width: "32px", height: "27px", filter: "invert(1)" }} alt="cart" />
          </div>
        </div>
      )}
    </div>
  );
}
