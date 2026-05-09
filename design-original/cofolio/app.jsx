// Mount the app — SPA router selecting between Landing and inner pages

function Landing() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px]">
        <div className="absolute left-1/2 -translate-x-1/2 -top-40 h-[500px] w-[1200px] rounded-full bg-violet-700/15 blur-[120px]"></div>
        <div className="absolute right-0 top-40 h-[400px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
      </div>

      <Nav />
      <Hero />
      <Problem />
      <Features />
      <BeforeAfter />
      <Workflow />
      <Templates />
      <Dashboard />
      <PortfolioScore />
      <Showcase />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function App() {
  useReveal();
  const route = useHashRoute();

  let page;
  if (route === ROUTES.LOGIN) page = <LoginPage/>;
  else if (route === ROUTES.BUILDER) page = <BuilderPage/>;
  else if (route === ROUTES.GENERATING) page = <GeneratingPage/>;
  else if (route === ROUTES.RESULT) page = <ResultPage/>;
  else if (route === ROUTES.DASHBOARD) page = <DashboardPage/>;
  else page = <Landing/>;

  return (
    <ThemeProvider>
      <BuilderProvider>
        {page}
        <ThemeFab/>
      </BuilderProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
