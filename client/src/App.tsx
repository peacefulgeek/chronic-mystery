import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CookieConsent from "./components/layout/CookieConsent";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import ArticlesPage from "./pages/ArticlesPage";
import AboutPage from "./pages/AboutPage";
import StartHerePage from "./pages/StartHerePage";
import EnergyAuditPage from "./pages/EnergyAuditPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/start-here" component={StartHerePage} />
      <Route path="/energy-audit" component={EnergyAuditPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Router />
          </div>
          <Footer />
        </div>
        <CookieConsent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
