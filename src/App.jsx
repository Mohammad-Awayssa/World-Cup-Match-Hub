import { HashRouter, Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/DataProvider';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import GroupsPage from './pages/GroupsPage';
import KnockoutPage from './pages/KnockoutPage';
import AboutPage from './pages/AboutPage';
import { LanguageProvider } from './context/LanguageContext';
import ScrollManager from './components/layout/ScrollManager';

function RoutedApp() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/knockout" element={<KnockoutPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <HashRouter>
          <ScrollManager />
          <RoutedApp />
        </HashRouter>
      </DataProvider>
    </LanguageProvider>
  );
}
