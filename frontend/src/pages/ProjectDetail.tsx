import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectHero from "@/components/project-detail/ProjectHero";
import ProjectOverview from "@/components/project-detail/ProjectOverview";
import ImageGallery from "@/components/project-detail/ImageGallery";
import ProfilesSection from "@/components/project-detail/ProfilesSection";
import PropertiesGrid from "@/components/project-detail/PropertiesGrid";
import AboutCity from "@/components/project-detail/AboutCity";
import PaymentPlan from "@/components/project-detail/PaymentPlan";
import UnitTypes from "@/components/project-detail/UnitTypes";
import FAQs from "@/components/project-detail/FAQs";
import SimilarProjects from "@/components/project-detail/SimilarProjects";

const ProjectDetail = () => {
  const { id } = useParams(); // yahan tumhe /:id milega
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/project-details/${id}`, {
      credentials: 'include',
    })
      .then((res) => {
        console.log("Project API status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Project detail response:", data);
        setProject(data);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return <Navigate to="/404" replace />;
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Project Hero Section */}
        <ProjectHero projectId={project._id} />

        {/* Project Overview */}
        <ProjectOverview projectId={project._id} />

        {/* Image Gallery */}
        <ImageGallery images={project.gallery || []} title={project.title} />

        {/* Profiles Section */}
        <ProfilesSection />

        {/* Properties for Sale in City */}
        <PropertiesGrid city={project.city} />

        {/* About City */}
        <AboutCity city={project.city} />

        {/* Payment Plan */}
        <PaymentPlan
          paymentSchedule={project.paymentSchedule || []}
          paymentPlan={project.paymentPlan || []}
        />

        {/* Unit Types */}
        <UnitTypes unitTypes={project.unitTypes || []} />

        {/* FAQs */}
        <FAQs faqs={project.faqs || []} city={project.city} />

        {/* Similar Projects */}
        <SimilarProjects currentProjectId={project._id} city={project.city} />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
