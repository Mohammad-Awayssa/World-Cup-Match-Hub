import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DataProvider } from './context/DataProvider';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import GroupsPage from './pages/GroupsPage';
import AboutPage from './pages/AboutPage';

function RoutedApp() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default function App() {
  return <DataProvider><HashRouter><RoutedApp /></HashRouter></DataProvider>;
}
