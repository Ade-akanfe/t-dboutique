import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/sections/HeroSection";
import FeaturedCollection from "./components/sections/FeaturedCollection";
import CategorySection from "./components/sections/CategorySection";
import NewArrivalsSection from "./components/sections/NewArrivalsSection";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import LocationSection from "./components/sections/LocationSection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturedCollection />
      <CategorySection />
      <NewArrivalsSection />
      <AboutSection />
      <ContactSection />
      <LocationSection />
      <Footer />
    </main>
  );
}
