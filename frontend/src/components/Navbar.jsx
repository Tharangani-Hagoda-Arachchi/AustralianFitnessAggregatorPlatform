import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/TheamContext";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { logout } from "../features/auth/authSlice";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        darkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {darkMode ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
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
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const links = (
    <>
      <Link
        to="/gyms"
        onClick={closeMenu}
        className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
      >
        Find a gym
      </Link>

      {isAuthenticated && user?.role === "user" && (
        <>
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
          >
            Dashboard
          </Link>

          <Link
            to="/checkin"
            onClick={closeMenu}
            className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
          >
            Check in
          </Link>

          <Link
            to="/bookings"
            onClick={closeMenu}
            className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
          >
            My bookings
          </Link>
        </>
      )}

      {isAuthenticated && user?.role === "owner" && (
        <>
          <Link
            to="/owner"
            onClick={closeMenu}
            className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
          >
            Owner dashboard
          </Link>

          <Link
            to="/owner/scan"
            onClick={closeMenu}
            className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
          >
            Scan check-ins
          </Link>
        </>
      )}

      {isAuthenticated && user?.role === "admin" && (
        <Link
          to="/admin"
          onClick={closeMenu}
          className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline sm:py-0"
        >
          Admin dashboard
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold text-emerald-700 dark:text-emerald-400"
        >
          FitFinder<span className="text-red-500">AU</span>
        </Link>

        <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
          {links}

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-700">
              <span className="hidden text-gray-500 dark:text-gray-400 lg:inline">
                Hi, {user?.name?.split(" ")[0]}
              </span>

              <button
                onClick={handleLogout}
                className="btn-secondary !px-4 !py-1.5"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4 dark:border-gray-700">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="btn-primary !px-4 !py-1.5"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200"
          >
            {menuOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 text-sm font-medium dark:border-gray-700 dark:bg-gray-900 sm:hidden">
          {links}

          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn-secondary w-full"
              >
                Log out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="btn-secondary w-full text-center"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="btn-primary w-full text-center"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;