import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import PopularSearches from "@/components/PopularSearches";
import AgenciesCarousel from "@/components/AgenciesCarousel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        {/* <ProjectsCarousel /> */}
        <PopularSearches />
        {/* <AgenciesCarousel /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
