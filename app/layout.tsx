import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "TripBuddy | Discover India Differently",
  description: "Curated travel experiences across India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
<body>
  <Navbar />
  {children}
  <Footer />
</body>
    </html>
  );
}