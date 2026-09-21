import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Hosts, HostDetail } from './pages/Hosts';
import { Guides, GuideDetail } from './pages/Guides';
import { Diagnostics } from './pages/Diagnostics';
import { Forum, ForumThreadPage } from './pages/Forum';
import { About } from './pages/About';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hosts" element={<Hosts />} />
          <Route path="/hosts/:id" element={<HostDetail />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:id" element={<GuideDetail />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumThreadPage />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
