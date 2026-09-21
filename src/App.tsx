import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ForumProvider } from './contexts/ForumContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Hosts, HostDetail } from './pages/Hosts';
import { Guides, GuideDetail } from './pages/Guides';
import { Diagnostics } from './pages/Diagnostics';
import { Forum, ForumThreadPage } from './pages/Forum';
import { About } from './pages/About';
import { TagPage } from './pages/TagPage';
import { Login, Register } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <ForumProvider>
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
              <Route path="/tags/:tag" element={<TagPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </HashRouter>
      </ForumProvider>
    </AuthProvider>
  );
}
