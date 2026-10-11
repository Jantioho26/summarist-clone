"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { LuHouse } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { RiBallPenLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { BsQuestionCircle } from "react-icons/bs";
import { MdLogin } from "react-icons/md";
import AuthModal from "./AuthModal";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState(16);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const changeFontSize = (size: number) => {
    setSelectedFontSize(size);

    document.documentElement.style.setProperty(
      "--reader-font-size",
      `${size}px`,
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <button
        className="mobile-menu__button"
        type="button"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {isMobileMenuOpen && (
        <div
          className="mobile-menu__overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isMobileMenuOpen ? "sidebar--open" : ""}`}
        data-menu-open={isMobileMenuOpen}
      >
        <div className="sidebar__logo">
          <img src="/logo.png" alt="Summarist logo" />
        </div>
        <div className="sidebar__wrapper">
          <div className="sidebar__top">
            <nav className="nav__links">
              <div
                className={`sidebar__link ${
                  pathname === "/for-you" ? "sidebar__link--active" : ""
                }`}
              >
                <LuHouse />
                <Link
                  href="/for-you"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For You
                </Link>
              </div>

              <div
                className={`sidebar__link ${
                  pathname === "/my-library" ? "sidebar__link--active" : ""
                }`}
              >
                <CiBookmark />
                <Link
                  href="/my-library"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Library
                </Link>
              </div>

              <div className="sidebar__link sidebar__link--disabled">
                <RiBallPenLine />
                <span>Highlights</span>
              </div>

              <div className="sidebar__link sidebar__link--disabled">
                <IoIosSearch />
                <span>Search</span>
              </div>
            </nav>
          </div>
          {pathname.startsWith("/player/") && (
            <div className="sidebar__font-size">
              {[14, 16, 18, 20].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => changeFontSize(size)}
                  className={
                    selectedFontSize === size ? "font-size--active" : ""
                  }
                  style={{ fontSize: `${size + 6}px` }}
                >
                  Aa
                </button>
              ))}
            </div>
          )}
          <div className="sidebar__bottom">
            <div
              className={`sidebar__link ${
                pathname === "/settings" ? "sidebar__link--active" : ""
              }`}
            >
              <CiSettings />
              <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                Settings
              </Link>
            </div>

            <div className="sidebar__link sidebar__link--disabled">
              <BsQuestionCircle />
              <span>Help & Support</span>
            </div>

            <div className="sidebar__link">
              <MdLogin />
              {user ? (
                <button
                  className="sidebar__logout"
                  onClick={() => signOut(auth)}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="sidebar__logout"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </aside>
    </>
  );
}
