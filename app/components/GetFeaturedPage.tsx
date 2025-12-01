"use client";

import { useState } from "react";
import { COLORS } from "../colors";

interface GetFeaturedPageProps {
  onClose: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToCart?: () => void;
}

export default function GetFeaturedPage({ onClose, onNavigateToAbout, onNavigateToCart }: GetFeaturedPageProps) {
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
    // Here you would typically send the data to your backend or Tally
    console.log("Form submitted:", formData, profilePicture);
    setSubmitted(true);
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] overflow-y-auto"
      style={{ backgroundColor: "white" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 text-black hover:opacity-70 cursor-pointer z-[2002]"
        style={{
          fontSize: "28px",
          fontFamily: "var(--font-avant-garde-book)",
          background: "none",
          border: "none",
        }}
      >
        ✕
      </button>

      <div className="min-h-screen flex flex-col items-start py-16 pb-32" style={{ paddingLeft: "25%", paddingRight: "10%" }}>
          {submitted ? (
            /* Success Message */
            <div className="flex flex-col items-start">
              <h1
                style={{
                  fontSize: "36px",
                  fontFamily: "var(--font-avant-garde-medium)",
                  marginBottom: "24px",
                  color: "black",
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
                fontSize: "38px",
                fontFamily: "var(--font-avant-garde-medium)",
                lineHeight: "100%",
                color: "black",
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
              }}
            >
              Follow us on instagram:{" "}
              <a 
                href="https://www.instagram.com/thehopartclub/" 
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
              }}
            >
              Connect with the founder:
            </p>
            <p
              className="mb-1"
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-avant-garde-book)",
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
              }}
            >
              Your Info:
            </h2>

            {/* Form */}
            <form 
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-start"
              style={{ maxWidth: "500px" }}
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
            </form>
          </>
        )}
      </div>

      {/* Footer - Bottom Left: Frog Logo */}
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

      {/* Footer - Bottom Right: Navigation */}
      <div 
        className="fixed z-[2010] pointer-events-auto flex items-center"
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
