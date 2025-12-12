"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS } from "../colors";
import { useCart } from "./CartContext";
import { useMobile } from "../hooks/useMobile";

interface GetFeaturedPageProps {
  onClose: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToCart?: () => void;
}

export default function GetFeaturedPage({ onClose, onNavigateToAbout, onNavigateToCart }: GetFeaturedPageProps) {
  const { getTotalItems } = useCart();
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    instagram: "",
    bio: "",
    driveLink: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Handle scroll to show/hide mobile header
  useEffect(() => {
    if (!isMobile) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setHeaderVisible(false);
      } else {
        // Scrolling up
        setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send form data to backend
    setSubmitted(true);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-[2000] overflow-y-auto"
      style={{ backgroundColor: "white" }}
    >
      <div 
        className="min-h-screen flex flex-col py-16 pb-32" 
        style={{ 
          paddingLeft: isMobile ? "8%" : "25%", 
          paddingRight: isMobile ? "8%" : "10%",
          alignItems: "flex-start",
        }}
      >
          {submitted ? (
            /* Success Message */
            <div 
              className="flex flex-col"
              style={{ alignItems: "flex-start" }}
            >
              <h1
                style={{
                  fontSize: "36px",
                  fontFamily: "var(--font-avant-garde-medium)",
                  marginBottom: "24px",
                  color: "black",
                  textAlign: "left",
                }}
              >
                Thank You!
              </h1>
              <p
                style={{
                  fontSize: "20px",
                  fontFamily: "var(--font-avant-garde-book)",
                  maxWidth: "500px",
                  lineHeight: "150%",
                  color: "black",
                  textAlign: "left",
                }}
              >
                We've received your submission. We'll review your work and get back to you soon.
              </p>
              <button
                onClick={onClose}
                className="mt-12 cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: "black",
                color: "white",
                border: "none",
                padding: "16px 48px",
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-medium)",
                borderRadius: "8px",
              }}
            >
              Back to Gallery
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <h1
              className="mb-6"
              style={{
                fontSize: isMobile ? "32px" : "38px",
                fontFamily: "var(--font-avant-garde-medium)",
                lineHeight: "100%",
                color: "black",
                textAlign: "left",
                width: "100%",
                maxWidth: "550px",
              }}
            >
              Hop Art Club
            </h1>

            <p
              className="mb-4"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                maxWidth: "550px",
                lineHeight: "160%",
                color: "black",
                textAlign: "left",
              }}
            >
              We are a marketing and distribution agency for emerging artists. In a world overwhelmed by AI-generated content, we highlight the creativity that comes from lived experience, emotion, and imagination.
            </p>

            <p
              className="mb-6"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                maxWidth: "550px",
                lineHeight: "160%",
                color: "black",
                textAlign: "left",
              }}
            >
              You create the art, and we'll handle the rest. Artists receive a share of the profit from every sale.
            </p>

            <p
              className="mb-2"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                color: "black",
                textAlign: "left",
                width: "100%",
                maxWidth: "550px",
              }}
            >
              Join us in celebrating the human touch.
            </p>

            <p
              className="mb-6"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                color: "black",
                textAlign: "left",
                width: "100%",
                maxWidth: "550px",
              }}
            >
              Follow us on instagram:{" "}
              <a 
                href="https://www.instagram.com/hop_art_house?igsh=NmRuMmhscHg4NG5y" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "#2563eb" }}
                className="underline hover:opacity-70"
              >
                Hop Art Club
              </a>
            </p>

            <p
              className="mb-1"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                color: "black",
                textAlign: "left",
                width: "100%",
                maxWidth: "550px",
              }}
            >
              Connect with the founder:
            </p>
            <p
              className="mb-1"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                textAlign: "left",
                width: "100%",
                maxWidth: "550px",
              }}
            >
              <a 
                href="https://www.instagram.com/cr3ative_27/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "#2563eb" }}
                className="underline hover:opacity-70"
              >
                Hamid Mubariz
              </a>
            </p>
            <p
              className="mb-12"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
                color: "black",
                textAlign: "left",
                width: "100%",
                maxWidth: "550px",
              }}
            >
              RCAD 2024
            </p>

            {/* Your Info Header */}
            <h2
              className="mb-6"
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-avant-garde-medium)",
                color: "black",
                textAlign: "left",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              Your Info:
            </h2>

            {/* Form */}
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ 
                maxWidth: "500px", 
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              {/* Name */}
              <div className="w-full mb-6">
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Preferred Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  style={{
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontFamily: "var(--font-avant-garde-book)",
                    border: "2px solid black",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                  }}
                />
              </div>

              {/* Email */}
              <div className="w-full mb-6">
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  style={{
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontFamily: "var(--font-avant-garde-book)",
                    border: "2px solid black",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                  }}
                />
              </div>

              {/* Portfolio */}
              <div className="w-full mb-6">
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Portfolio link:</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://"
                  className="w-full"
                  style={{
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontFamily: "var(--font-avant-garde-book)",
                    border: "2px solid black",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                  }}
                />
              </div>

              {/* Instagram */}
              <div className="w-full mb-6">
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Instagram link:</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                  className="w-full"
                  style={{
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontFamily: "var(--font-avant-garde-book)",
                    border: "2px solid black",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                  }}
                />
              </div>

              {/* Bio */}
              <div className="w-full mb-6">
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Bio (500 characters)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={4}
                  className="w-full resize-none"
                  style={{
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontFamily: "var(--font-avant-garde-book)",
                    border: "2px solid black",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                  }}
                />
              </div>

              {/* Profile Picture */}
              <div className="w-full mb-6">
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Profile Picture: (Square)
                </label>
                <div
                  className="w-full flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
                  style={{
                    padding: "32px 16px",
                    border: "2px dashed black",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                  onClick={() => document.getElementById("profilePicInput")?.click()}
                >
                  <input
                    type="file"
                    id="profilePicInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    {/* Upload Icon */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "var(--font-avant-garde-book)",
                        color: "black",
                      }}
                    >
                      {profilePicture ? profilePicture.name : "Click to choose a file or drag here"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-avant-garde-book)",
                      color: "#666",
                      marginTop: "8px",
                    }}
                  >
                    Size limit: 10 MB
                  </span>
                </div>
              </div>

              {/* Google Drive Link */}
              <div className="w-full mb-8">
                <label
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-avant-garde-medium)",
                    display: "block",
                    marginBottom: "8px",
                    color: "black",
                  }}
                >
                  Google Drive Link:
                </label>
                <p
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    marginBottom: "12px",
                    lineHeight: "160%",
                    color: "black",
                  }}
                >
                  You can upload up to 10 artworks in your folder, each with a 400-character description.
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-avant-garde-book)",
                    marginBottom: "16px",
                    lineHeight: "160%",
                    color: "black",
                  }}
                >
                  Procreate works are preferred for their time-lapse feature; if available, upload the process video too. A QR code linking to it will be printed on the poster. Non-Procreate works are also welcomed. So video is optional but encouraged. Feel free to be creative and narrate your video.
                </p>
                <input
                  type="url"
                  name="driveLink"
                  value={formData.driveLink}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  required
                  className="w-full"
                  style={{
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontFamily: "var(--font-avant-garde-book)",
                    border: "2px solid black",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: isMobile ? "flex-end" : "flex-start", width: "100%" }}>
                <button
                  type="submit"
                  className="cursor-pointer hover:opacity-80 flex items-center gap-2"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: "black",
                    border: "none",
                    padding: "12px 48px",
                    fontSize: "18px",
                    fontFamily: "var(--font-avant-garde-medium)",
                    borderRadius: "8px",
                    marginTop: "16px",
                  }}
                >
                  Submit
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Footer - Bottom Left (Desktop only): Frog Logo */}
      {!isMobile && (
        <div 
          className="fixed z-[2010] pointer-events-auto"
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
      )}

      {/* Mobile: Cart + Hamburger Menu */}
      {isMobile && (
        <div 
          className="fixed z-[2010] pointer-events-auto flex items-center"
          style={{
            top: headerVisible ? "20px" : "-60px",
            right: "20px",
            gap: "16px",
            transition: "top 0.3s ease-in-out",
          }}
        >
          {/* Cart */}
          <div 
            onClick={onNavigateToCart}
            className="cursor-pointer hover:opacity-70"
            style={{ position: "relative" }}
          >
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

          {/* Hamburger Menu Button */}
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

      {/* Mobile Menu Side Panel */}
      {isMobile && menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[2020] pointer-events-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Side Panel */}
          <div 
            className="fixed z-[2030] pointer-events-auto bg-white"
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
            {/* Close Button */}
            <div 
              className="flex justify-end mb-8"
            >
              <div 
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer"
                style={{ fontSize: "28px", lineHeight: "1" }}
              >
                ✕
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex flex-col" style={{ gap: "24px" }}>
              <span 
                onClick={() => { onClose(); setMenuOpen(false); }}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                Art House
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <span 
                onClick={() => { onNavigateToAbout?.(); setMenuOpen(false); }}
                className="text-black no-underline hover:opacity-70 cursor-pointer"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
              >
                About
              </span>
              <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
              <span 
                className="text-black no-underline cursor-default"
                style={{ fontSize: "20px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
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

      {/* Desktop: Footer Navigation */}
      {!isMobile && (
        <div 
          className="fixed z-[2010] pointer-events-auto flex items-center"
          style={{
            bottom: "20px",
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
            onClick={onNavigateToAbout}
            className="text-black no-underline hover:opacity-70 cursor-pointer"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-book)" }}
          >
            About
          </span>
          <span 
            className="text-black no-underline cursor-default"
            style={{ fontSize: "15px", lineHeight: "100%", fontFamily: "var(--font-avant-garde-medium)" }}
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
            <img
              src="/Cart.svg"
              style={{ width: "32px", height: "27px" }}
              alt="cart"
            />
          </div>
        </div>
      )}
    </div>
  );
}
