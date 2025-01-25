"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * ClientLayout Component
 *
 * This component is responsible for rendering dynamic client-side logic for the application layout.
 * It uses `usePathname` (a client-side hook from Next.js) to determine the current route and conditionally
 * renders the Navbar and Footer components based on the route.
 *
 * Why do we need this component?
 * - The `RootLayout` in Next.js is a server-side component by default.
 * - `usePathname` can only be used in a client-side component because it relies on browser-side routing.
 * - If we used `usePathname` directly in `RootLayout`, it would require making it a client component,
 *   but doing so would break server-side features like the `export const metadata` API.
 *
 * Solution:
 * - Keep `RootLayout` as a server-side component for metadata and app-wide structure.
 * - Offload client-side dynamic logic (like route checks with `usePathname`) to `ClientLayout`,
 *   which is rendered inside `RootLayout`.
 *
 * Result:
 * - Metadata and server-side features remain functional.
 * - Conditional rendering of Navbar and Footer works as expected for different routes.
 */

const noNavAndFooter = ["/login", "/register", "/forgot-password"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavAndFooter = !noNavAndFooter.includes(pathname);

  return (
    <>
      {showNavAndFooter && <Navbar />}
      <main className='flex-grow'>{children}</main>
      {showNavAndFooter && <Footer />}
    </>
  );
}
