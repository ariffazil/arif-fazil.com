import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import ArrowNavbar from '@/components/ArrowNavbar';
import ArrowFooter from '@/components/ArrowFooter';
import { ScrollToHashElement } from '@/components/ScrollToHashElement';

// Route-level code splitting (audit N4, 2026-09-24): setiap halaman = chunk lazy.
// Bundle monolitik 2.3MB dipecah — entry kini kecil, halaman dimuat atas permintaan.
// Semua pages guna named export → dipetakan ke default utk React.lazy.
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const Sanctuary = lazy(() => import('@/pages/Sanctuary').then(m => ({ default: m.Sanctuary })));
const Human = lazy(() => import('@/pages/Human').then(m => ({ default: m.Human })));
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const MakcikGPTAlias = lazy(() => import('@/pages/MakcikGptAlias').then(m => ({ default: m.MakcikGPTAlias })));
const RealityReceiptPage = lazy(() => import('@/pages/RealityReceiptPage').then(m => ({ default: m.RealityReceiptPage })));
const MakcikGptArticle = lazy(() => import('@/pages/MakcikGptArticle').then(m => ({ default: m.MakcikGptArticle })));
const World = lazy(() => import('@/pages/WorldArrow').then(m => ({ default: m.World })));
const CommodityPage = lazy(() => import('@/pages/CommodityPage').then(m => ({ default: m.CommodityPage })));
const Words = lazy(() => import('@/pages/Words').then(m => ({ default: m.Words })));
const EssayPage = lazy(() => import('@/pages/EssayPage').then(m => ({ default: m.EssayPage })));
const Work = lazy(() => import('@/pages/Work').then(m => ({ default: m.Work })));
const Missions = lazy(() => import('@/pages/Missions').then(m => ({ default: m.Missions })));
const Proof = lazy(() => import('@/pages/ProofArrow').then(m => ({ default: m.Proof })));
const Genesis = lazy(() => import('@/pages/Genesis').then(m => ({ default: m.Genesis })));
const AAA = lazy(() => import('@/pages/AAA').then(m => ({ default: m.AAA })));
const Economics = lazy(() => import('@/pages/EconomicsArrow').then(m => ({ default: m.Economics })));
const Wealth = lazy(() => import('@/pages/Wealth').then(m => ({ default: m.Wealth })));
const WealthArticle = lazy(() => import('@/pages/WealthArticle').then(m => ({ default: m.WealthArticle })));
const PoliticsHub = lazy(() => import('@/pages/PoliticsHub').then(m => ({ default: m.PoliticsHub })));
const NSElectionPage = lazy(() => import('@/pages/NSElectionPage').then(m => ({ default: m.NSElectionPage })));
const PlaybookPage = lazy(() => import('@/pages/PlaybookPage').then(m => ({ default: m.PlaybookPage })));
const AnwarIbrahim33 = lazy(() => import('@/pages/AnwarIbrahim33').then(m => ({ default: m.AnwarIbrahim33 })));
const ShadowPMs = lazy(() => import('@/pages/ShadowPMs').then(m => ({ default: m.ShadowPMs })));
const ShadowBoard = lazy(() => import('@/pages/ShadowBoard').then(m => ({ default: m.ShadowBoard })));
const DeritaMap = lazy(() => import('@/pages/DeritaMap').then(m => ({ default: m.DeritaMap })));
const InstitutionPage = lazy(() => import('@/pages/InstitutionPage').then(m => ({ default: m.InstitutionPage })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

export function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <div className="flex min-h-screen flex-col bg-[#0A0B0D] text-[#EDEAE2]">
        <ArrowNavbar />
        <main className="flex-1">
          <Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* 0. /about — Human-readable bio & on-ramp */}
            <Route path="/about" element={<About />} />
            <Route path="/about/" element={<About />} />
            <Route path="/bio" element={<Navigate to="/about" replace />} />
            <Route path="/bio/" element={<Navigate to="/about" replace />} />

            {/* 0b. /sanctuary — Human-facing introduction to arifOS */}
            <Route path="/sanctuary" element={<Sanctuary />} />
            <Route path="/sanctuary/" element={<Sanctuary />} />

            {/* 0c. /human — canonical agent start-here (public /agent is Caddy 404 HOLD) */}
            <Route path="/human" element={<Human />} />
            <Route path="/human/" element={<Human />} />

            {/* 1. /home & / */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/" element={<Navigate to="/home" replace />} />

            {/* 2. /earth */}
            <Route path="/earth" element={<EarthGlobeRedirect />} />
            <Route path="/earth/" element={<EarthGlobeRedirect />} />
            <Route path="/earth/*" element={<EarthGlobeRedirect />} />

            {/* 3. MakcikGPT Civic Intelligence — Subordinate to WORLD */}
            <Route path="/world/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/world/makcikgpt/:slug/receipt" element={<RealityReceiptPage />} />
            <Route path="/world/makcikgpt/:slug" element={<MakcikGptArticle />} />

            {/* Aliases & Redirects to canonical /world/makcikgpt */}
            <Route path="/makcikgpt" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/makcikgpt/" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/hermes/makcikgpt" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/hermes/makcikgpt/" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/hermes/makcikgpt/:slug" element={<MakcikGptRedirect />} />

            {/* 3b. /world — Situational Intelligence, Global Commodities, Palantir Atlas */}
            <Route path="/world" element={<World />} />
            <Route path="/world/" element={<World />} />
            <Route path="/worlds" element={<Navigate to="/world" replace />} />
            <Route path="/worlds/" element={<Navigate to="/world" replace />} />
            <Route path="/world/oil" element={<CommodityPage slug="oil" />} />
            <Route path="/world/oil/" element={<CommodityPage slug="oil" />} />
            <Route path="/world/gas" element={<CommodityPage slug="gas" />} />
            <Route path="/world/gas/" element={<CommodityPage slug="gas" />} />
            <Route path="/world/gold" element={<CommodityPage slug="gold" />} />
            <Route path="/world/gold/" element={<CommodityPage slug="gold" />} />
            <Route path="/world/klci" element={<CommodityPage slug="klci" />} />
            <Route path="/world/klci/" element={<CommodityPage slug="klci" />} />
            <Route path="/world/usdmyr" element={<CommodityPage slug="usdmyr" />} />
            <Route path="/world/usdmyr/" element={<CommodityPage slug="usdmyr" />} />
            
            {/* /world/economics/* routes */}
            <Route path="/world/economics/oil" element={<CommodityPage slug="oil" />} />
            <Route path="/world/economics/oil/" element={<CommodityPage slug="oil" />} />
            <Route path="/world/economics/gas" element={<CommodityPage slug="gas" />} />
            <Route path="/world/economics/gas/" element={<CommodityPage slug="gas" />} />
            <Route path="/world/economics/gold" element={<CommodityPage slug="gold" />} />
            <Route path="/world/economics/gold/" element={<CommodityPage slug="gold" />} />
            <Route path="/world/economics/klci" element={<CommodityPage slug="klci" />} />
            <Route path="/world/economics/klci/" element={<CommodityPage slug="klci" />} />
            <Route path="/world/economics/usdmyr" element={<CommodityPage slug="usdmyr" />} />
            <Route path="/world/economics/usdmyr/" element={<CommodityPage slug="usdmyr" />} />

            {/* /economics/* routes */}
            <Route path="/economics/oil" element={<CommodityPage slug="oil" />} />
            <Route path="/economics/oil/" element={<CommodityPage slug="oil" />} />
            <Route path="/economics/gas" element={<CommodityPage slug="gas" />} />
            <Route path="/economics/gas/" element={<CommodityPage slug="gas" />} />
            <Route path="/economics/gold" element={<CommodityPage slug="gold" />} />
            <Route path="/economics/gold/" element={<CommodityPage slug="gold" />} />
            <Route path="/economics/klci" element={<CommodityPage slug="klci" />} />
            <Route path="/economics/klci/" element={<CommodityPage slug="klci" />} />
            <Route path="/economics/usdmyr" element={<CommodityPage slug="usdmyr" />} />
            <Route path="/economics/usdmyr/" element={<CommodityPage slug="usdmyr" />} />

            {/* Root alias routes */}
            <Route path="/oil" element={<CommodityPage slug="oil" />} />
            <Route path="/oil/" element={<CommodityPage slug="oil" />} />
            <Route path="/gas" element={<CommodityPage slug="gas" />} />
            <Route path="/gas/" element={<CommodityPage slug="gas" />} />
            <Route path="/gold" element={<CommodityPage slug="gold" />} />
            <Route path="/gold/" element={<CommodityPage slug="gold" />} />
            <Route path="/klci" element={<CommodityPage slug="klci" />} />
            <Route path="/klci/" element={<CommodityPage slug="klci" />} />
            <Route path="/usdmyr" element={<CommodityPage slug="usdmyr" />} />
            <Route path="/usdmyr/" element={<CommodityPage slug="usdmyr" />} />

            {/* 3.1 Sub-routes for world */}
            <Route path="/world/vitals" element={<Navigate to="/wealth/vitals/" replace />} />
            <Route path="/world/vitals/" element={<Navigate to="/wealth/vitals/" replace />} />
            <Route path="/world/malaysia" element={<Navigate to="/wealth/malaysia/" replace />} />
            <Route path="/world/malaysia/" element={<Navigate to="/wealth/malaysia/" replace />} />
            <Route path="/world/propa" element={<Navigate to="/world" replace />} />
            <Route path="/world/propa/" element={<Navigate to="/world" replace />} />
            <Route path="/propa" element={<Navigate to="/world" replace />} />
            <Route path="/propa/" element={<Navigate to="/world" replace />} />
            <Route path="/malaysia" element={<Navigate to="/wealth/malaysia/" replace />} />
            <Route path="/malaysia/" element={<Navigate to="/wealth/malaysia/" replace />} />

            {/* 4. /words — Essays (S1-S9), Wiki, Knowledge Base */}
            <Route path="/words" element={<Words />} />
            <Route path="/words/" element={<Words />} />
            <Route path="/words/writing" element={<Navigate to="/words" replace />} />
            <Route path="/words/writing/" element={<Navigate to="/words" replace />} />
            <Route path="/words/writing/:slug" element={<EssayPage />} />
            <Route path="/words/writing/:slug/" element={<EssayPage />} />
            <Route path="/words/:slug" element={<EssayPage />} />
            <Route path="/words/:slug/" element={<EssayPage />} />
            <Route path="/writing" element={<Navigate to="/words" replace />} />
            <Route path="/writing/" element={<Navigate to="/words" replace />} />
            <Route path="/writing/:slug" element={<EssayPage />} />
            <Route path="/writing/:slug/" element={<EssayPage />} />
            <Route path="/read" element={<Navigate to="/words" replace />} />
            <Route path="/read/" element={<Navigate to="/words" replace />} />
            <Route path="/essays" element={<Navigate to="/words" replace />} />
            <Route path="/essays/" element={<Navigate to="/words" replace />} />
            <Route path="/essays/:slug" element={<EssayPage />} />
            <Route path="/essays/:slug/" element={<EssayPage />} />
            <Route path="/wiki" element={<Navigate to="/words" replace />} />
            <Route path="/wiki/" element={<Navigate to="/words" replace />} />
            <Route path="/wiki/*" element={<Navigate to="/words" replace />} />

            {/* 5. /work — Systems, The Wells Record, Operations */}
            <Route path="/work" element={<Work />} />
            <Route path="/work/" element={<Work />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/missions/" element={<Missions />} />

            {/* 6. /999 — Proof & Immutable Seals */}
            <Route path="/999" element={<Proof />} />
            <Route path="/999/" element={<Proof />} />
            <Route path="/proof" element={<Proof />} />
            <Route path="/proof/" element={<Proof />} />

            {/* 7. /000 — Genesis & Sovereign Origin */}
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/genesis" element={<Genesis />} />
            <Route path="/genesis/" element={<Genesis />} />

            {/* 8. /AAA — Unified Canon + Doctrine */}
            <Route path="/AAA" element={<AAA />} />
            <Route path="/AAA/" element={<AAA />} />
            <Route path="/aaa" element={<Navigate to="/AAA" replace />} />
            <Route path="/aaa/" element={<Navigate to="/AAA" replace />} />
            <Route path="/doctrine" element={<Navigate to="/AAA" replace />} />
            <Route path="/doctrine/" element={<Navigate to="/AAA" replace />} />
            <Route path="/canon" element={<Navigate to="/AAA" replace />} />
            <Route path="/canon/" element={<Navigate to="/AAA" replace />} />
            <Route path="/federation" element={<Navigate to="/AAA" replace />} />
            <Route path="/federation/" element={<Navigate to="/AAA" replace />} />

            {/* Economics & Capital */}
            <Route path="/economics" element={<Economics />} />
            <Route path="/economics/" element={<Economics />} />
            <Route path="/wealth" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth-live" element={<Wealth />} />
            <Route path="/wealth-live/" element={<Wealth />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />
            <Route path="/economics/article/:slug" element={<WealthArticle />} />
            <Route path="/wealth/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/economics/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/:slug" element={<MakcikGptRedirect />} />

            {/* Politics & Specialized Hubs */}
            <Route path="/politics" element={<PoliticsHub />} />
            <Route path="/politics/" element={<PoliticsHub />} />
            <Route path="/malaysia" element={<PoliticsHub />} />
            <Route path="/malaysia/" element={<PoliticsHub />} />
            <Route path="/politics/ns-election" element={<NSElectionPage />} />
            <Route path="/politics/ns-election/" element={<NSElectionPage />} />
            <Route path="/politics/ns-election/playbook" element={<PlaybookPage />} />
            <Route path="/politics/ns-election/playbook/" element={<PlaybookPage />} />
            <Route path="/politics/shadow/anwar-ibrahim" element={<AnwarIbrahim33 />} />
            <Route path="/politics/shadow" element={<ShadowPMs />} />
            <Route path="/politics/shadow/" element={<ShadowPMs />} />
            <Route path="/politics/shadow/board" element={<ShadowBoard />} />
            <Route path="/politics/shadow/board/" element={<ShadowBoard />} />
            <Route path="/politics/shadow/derita" element={<DeritaMap />} />
            <Route path="/politics/shadow/derita/" element={<DeritaMap />} />
            {/* 2026-09-25: canonical /world routes (alignment audit — canonical space is /world/*) */}
            <Route path="/world/politics/shadow" element={<ShadowPMs />} />
            <Route path="/world/politics/shadow/" element={<ShadowPMs />} />
            <Route path="/world/politics/shadow/board" element={<ShadowBoard />} />
            <Route path="/world/politics/shadow/board/" element={<ShadowBoard />} />
            <Route path="/world/politics/shadow/derita" element={<DeritaMap />} />
            <Route path="/world/politics/shadow/derita/" element={<DeritaMap />} />

            {/* Vitals, Institution, Discovery */}
            <Route path="/vitals" element={<Navigate to="/vitals/" replace />} />
            <Route path="/institution" element={<InstitutionPage />} />
            <Route path="/institution/" element={<InstitutionPage />} />
            <Route path="/verify" element={<Navigate to="/institution" replace />} />
            <Route path="/verify/" element={<Navigate to="/institution" replace />} />
            <Route path="/compliance" element={<Navigate to="/institution" replace />} />
            <Route path="/compliance/" element={<Navigate to="/institution" replace />} />
            <Route path="/discoveries" element={<Navigate to="/earth" replace />} />
            <Route path="/discoveries/" element={<Navigate to="/earth" replace />} />

            {/* Feeds & 404 */}
            <Route path="/rss" element={<Navigate to="/feed.xml" replace />} />
            <Route path="/rss/" element={<Navigate to="/feed.xml" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </main>
        <ArrowFooter />
      </div>
    </BrowserRouter>
  );
}

function RouteLoading() {
  return (
    <div className="mx-auto max-w-[40rem] px-6 py-24 font-mono text-sm text-[#9AA0A8]" role="status" aria-label="Loading">
      Memuat…
    </div>
  );
}

function EarthGlobeRedirect() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.startsWith('/earth')
      ? window.location.pathname + window.location.search + window.location.hash
      : '/earth/';
    window.location.replace(path.endsWith('/') || path.includes('.') ? path : path + '/');
  }
  return (
    <div className="mx-auto max-w-[40rem] px-6 py-24 font-mono text-sm text-[#9AA0A8]">
      Loading EARTH globe… <a className="text-[#E4572E] underline" href="/earth/">Continue →</a>
    </div>
  );
}

function MakcikGptRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/world/makcikgpt/${slug ?? ''}`} replace />;
}

export default App;
