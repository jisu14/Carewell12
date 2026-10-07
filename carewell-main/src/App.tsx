import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ExplorePage = lazy(() => import('@/pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const HomeCarePage = lazy(() => import('@/pages/HomeCarePage').then(m => ({ default: m.HomeCarePage })));
const ProviderDetailPage = lazy(() => import('@/pages/ProviderDetailPage').then(m => ({ default: m.ProviderDetailPage })));
const HomeCareBookingPage = lazy(() => import('@/pages/HomeCareBookingPage').then(m => ({ default: m.HomeCareBookingPage })));
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage').then(m => ({ default: m.DoctorsPage })));
const DoctorDetailPage = lazy(() => import('@/pages/DoctorDetailPage').then(m => ({ default: m.DoctorDetailPage })));
const DoctorBookingPage = lazy(() => import('@/pages/DoctorBookingPage').then(m => ({ default: m.DoctorBookingPage })));
const TelemedicinePage = lazy(() => import('@/pages/TelemedicinePage').then(m => ({ default: m.TelemedicinePage })));
const DoctorPrescriptionPage = lazy(() => import('@/pages/DoctorPrescriptionPage').then(m => ({ default: m.DoctorPrescriptionPage })));
const PrescriptionViewPage = lazy(() => import('@/pages/PrescriptionViewPage').then(m => ({ default: m.PrescriptionViewPage })));
const PrescriptionCartPage = lazy(() => import('@/pages/PrescriptionCartPage').then(m => ({ default: m.PrescriptionCartPage })));
const LabsPage = lazy(() => import('@/pages/LabsPage').then(m => ({ default: m.LabsPage })));
const LabDetailPage = lazy(() => import('@/pages/LabDetailPage').then(m => ({ default: m.LabDetailPage })));
const LabBookingPage = lazy(() => import('@/pages/LabBookingPage').then(m => ({ default: m.LabBookingPage })));
const PharmaciesPage = lazy(() => import('@/pages/PharmaciesPage').then(m => ({ default: m.PharmaciesPage })));
const EquipmentPage = lazy(() => import('@/pages/EquipmentPage').then(m => ({ default: m.EquipmentPage })));
const EquipmentDetailPage = lazy(() => import('@/pages/EquipmentDetailPage').then(m => ({ default: m.EquipmentDetailPage })));
const EquipmentBookingPage = lazy(() => import('@/pages/EquipmentBookingPage').then(m => ({ default: m.EquipmentBookingPage })));
const CarePage = lazy(() => import('@/pages/CarePage').then(m => ({ default: m.CarePage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const HealthRecordsPage = lazy(() => import('@/pages/HealthRecordsPage').then(m => ({ default: m.HealthRecordsPage })));
const DocumentViewPage = lazy(() => import('@/pages/DocumentViewPage').then(m => ({ default: m.DocumentViewPage })));
const FamilyPage = lazy(() => import('@/pages/FamilyPage').then(m => ({ default: m.FamilyPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const MedicationsPage = lazy(() => import('@/pages/MedicationsPage').then(m => ({ default: m.MedicationsPage })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-primary-600">Loading...</div>}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/home-care" element={<HomeCarePage />} />
            <Route path="/home-care/provider/:id" element={<ProviderDetailPage />} />
            <Route path="/home-care/provider/:id/book" element={<HomeCareBookingPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            <Route path="/doctors/:id/book" element={<DoctorBookingPage />} />
            <Route path="/telemedicine/:id" element={<TelemedicinePage />} />
            <Route path="/telemedicine/:id/prescription" element={<DoctorPrescriptionPage />} />
            <Route path="/prescription-view/:id" element={<PrescriptionViewPage />} />
            <Route path="/prescription-cart/:id" element={<PrescriptionCartPage />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/:id" element={<LabDetailPage />} />
            <Route path="/labs/:id/book/:testId" element={<LabBookingPage />} />
            <Route path="/pharmacies" element={<PharmaciesPage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
            <Route path="/equipment/:id/book" element={<EquipmentBookingPage />} />
            <Route path="/care" element={<CarePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/health-records" element={<HealthRecordsPage />} />
            <Route path="/health-records/:id" element={<DocumentViewPage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
