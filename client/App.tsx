import "./global.css";

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { SeoManager } from "./components/shared/SeoManager";

// Every page is loaded only when its route is visited. This keeps the admin
// login and dashboard from downloading the comparatively large home page.
const Index    = lazy(() => import("./pages/Index"));
const Apply    = lazy(() => import("./pages/Apply"));
const Team     = lazy(() => import("./pages/Team"));
const Projects = lazy(() => import("./pages/Projects"));
const Partners = lazy(() => import("./pages/Partners"));
const News     = lazy(() => import("./pages/News"));
const Contact  = lazy(() => import("./pages/Contact"));
const Admin    = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
  </div>
);

export const App = () => (
  <BrowserRouter>
        <SeoManager />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/"          element={<Index />} />
                      <Route path="/apply"     element={<Apply />} />
                      <Route path="/team"      element={<Team />} />
                      <Route path="/projects"  element={<Projects />} />
                      <Route path="/partners"  element={<Partners />} />
                      <Route path="/news"      element={<News />} />
                      <Route path="/contact"   element={<Contact />} />
                      <Route path="*"          element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
  </BrowserRouter>
);
