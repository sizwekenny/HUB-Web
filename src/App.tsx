import { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import DepartmentDetails from "./components/DepartmentDetails";
import ServiceDetails from "./components/ServiceDetails";
import UserManual from "./components/UserManual";
import Navigation from "./components/Navigation";
import EmaHomePage from "./components/Emalahleni/EmaHomePage";
import EmaDepartmentDetails from "./components/Emalahleni/EmaDepartmentDetails";
import EmaServiceDetails from "./components/Emalahleni/EmaServiceDetails";
import EmaUserManual from "./components/Emalahleni/emaUserManual";
import EmaNavigation from "./components/Emalahleni/EmaNavigation";
import PolHomePage from "./components/Polokwane/PolHomePage";
import PolDepartmentDetails from "./components/Polokwane/PolDepartmentDetails";
import PolServiceDetails from "./components/Polokwane/PolServiceDetails";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CampusVideosPage from "./components/CampusVideosPage";
import EmaCampusVideosPage from "./components/Emalahleni/CampusVideosPage";
import PolCampusVideosPage from "./components/Polokwane/CampusVideosPage";
import {
  departments,
  emaDepartments,
  polDepartments,
  services,
  emaServices,
  polServices,
} from "./data/data";
import { Department, Service } from "./types";

export default function App() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "senior" | "newcomer">("all");
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const handleLoginSuccess = () => navigate("/admin/dashboard");
  const handleLogout = () => navigate("/");
  // Routing is handled with react-router; local view/selection state removed


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        {/* ---------- Landing ---------- */}
        <Route
          path="/"
          element={
            <LandingPage
              onSelect={(page) => navigate(page)}
              onLogin={() => navigate("/admin/login")}
            />
          }
        />

        {/* ---------- Admin ---------- */}
        <Route
          path="/admin/login"
          element={<AdminLogin onBack={handleBack} onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard onLogout={handleLogout} onBackToHome={handleBack} />}
        />

        {/* ---------- Main Campus ---------- */}
        <Route
          path="/home"
          element={
            <>
              <Navigation
                departments={departments}
                services={services}
                currentView="home"
                onNavigate={(v) => navigate(v)}
                onFilterChange={setSelectedFilter}
              />
             <HomePage
                departments={departments}
                services={services}
                selectedFilter={selectedFilter}
                onDepartmentClick={(dept) => navigate(`/departments/${dept.id}`)}
                onServiceClick={(service) => navigate(`/services/${service.id}`)}
              />
            </>
          }
        />

        <Route
          path="/departments/:id"
          element={<DepartmentDetailsPage data={departments} />}
        />
        <Route
          path="/services/:id"
          element={<ServiceDetailsPage data={services} />}
        />

        <Route
          path="/manual"
          element={<UserManual onBack={handleBack} />}
        />

        {/* ---------- Emalahleni Campus ---------- */}
        <Route
          path="/emaHome"
          element={
            <>
              <EmaNavigation
                departments={emaDepartments}
                services={emaServices}
                currentView="ema"
                onNavigate={(v) => navigate(v)}
                onFilterChange={setSelectedFilter}
              />
              <EmaHomePage
                departments={emaDepartments}
                services={emaServices}
                selectedFilter={selectedFilter}
                onDepartmentClick={(dept) => navigate(`/emaHome/departments/${dept.id}`)}
                onServiceClick={(service) => navigate(`/emaHome/services/${service.id}`)}
              />
            </>
          }
        />

        <Route
          path="/emaHome/departments/:id"
          element={<EmaDepartmentDetailsPage data={emaDepartments} />}
        />
        <Route
          path="/emaHome/services/:id"
          element={<EmaServiceDetailsPage data={emaServices} />}
        />
        <Route
          path="/emaHome/manual"
          element={
            <>
              <EmaNavigation
                departments={emaDepartments}
                services={emaServices}
                currentView="manual"
                onNavigate={(v) => navigate(v)}
                onFilterChange={setSelectedFilter}
              />
              <EmaUserManual onBack={handleBack} />
            </>
          }
        />

        {/* ---------- Polokwane Campus ---------- */}
        <Route
          path="/polHome"
          element={
            <>
              <Navigation
                departments={polDepartments}
                services={polServices}
                currentView="pol"
                onNavigate={(v) => navigate(v)}
                onFilterChange={setSelectedFilter}
              />
              <PolHomePage
                departments={polDepartments}
                services={polServices}
                selectedFilter={selectedFilter}
                onDepartmentClick={(dept) => navigate(`/polHome/departments/${dept.id}`)}
                onServiceClick={(service) => navigate(`/polHome/services/${service.id}`)}
              />
            </>
          }
        />
        <Route
          path="/polHome/departments/:id"
          element={<PolDepartmentDetailsPage data={polDepartments} />}
        />
        <Route
          path="/polHome/services/:id"
          element={<PolServiceDetailsPage data={polServices} />}
        />

        {/* ---------- Shared Campus Pages ---------- */}
        <Route path="/campus-videos" element={<CampusVideosPage />} />
        <Route path="/ema-campus-videos" element={<EmaCampusVideosPage />} />
        <Route path="/pol-campus-videos" element={<PolCampusVideosPage />} />

        {/* ---------- Catch-all ---------- */}
        <Route
          path="*"
          element={<LandingPage onSelect={(p) => navigate(p)} onLogin={() => navigate("/admin/login")} />}
        />
      </Routes>
    </div>
  );
}

/* ------------------------------------------------------------------
   Helper wrappers: locate department/service by ID before rendering
------------------------------------------------------------------- */

function DepartmentDetailsPage({ data }: { data: Department[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const department = data.find((d) => d.id === id);
  if (!department) return <div>Department not found</div>;
  return <DepartmentDetails department={department} onBack={() => navigate(-1)} />;
}

function ServiceDetailsPage({ data }: { data: Service[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = data.find((s) => s.id === id);
  if (!service) return <div>Service not found</div>;
  return <ServiceDetails service={service} onBack={() => navigate(-1)} />;
}

/* ---------- EMA campus details pages ---------- */
function EmaDepartmentDetailsPage({ data }: { data: Department[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const department = data.find((d) => d.id === id);
  if (!department) return <div>Department not found</div>;
  return <EmaDepartmentDetails department={department} onBack={() => navigate(-1)} />;
}

function EmaServiceDetailsPage({ data }: { data: Service[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = data.find((s) => s.id === id);
  if (!service) return <div>Service not found</div>;
  return <EmaServiceDetails service={service} onBack={() => navigate(-1)} />;
}

/* ---------- POL campus details pages ---------- */
function PolDepartmentDetailsPage({ data }: { data: Department[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const department = data.find((d) => d.id === id);
  if (!department) return <div>Department not found</div>;
  return <PolDepartmentDetails department={department} onBack={() => navigate(-1)} />;
}

function PolServiceDetailsPage({ data }: { data: Service[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = data.find((s) => s.id === id);
  if (!service) return <div>Service not found</div>;
  return <PolServiceDetails service={service} onBack={() => navigate(-1)} />;
}
