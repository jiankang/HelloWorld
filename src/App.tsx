import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StarField from './components/StarField/StarField';
import Navigation from './components/Navigation/Navigation';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Library from './pages/Library';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#1a1a3a] text-white">
        <StarField />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/library" element={<Library />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}
