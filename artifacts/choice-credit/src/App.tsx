import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

// Route-level code splitting — each section loads independently
const Home = lazy(() => import("@/pages/public/Home"));
const Services = lazy(() => import("@/pages/public/Services"));
const Calculator = lazy(() => import("@/pages/public/Calculator"));
const Book = lazy(() => import("@/pages/public/Book"));
const BookConfirmation = lazy(() => import("@/pages/public/BookConfirmation"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const Login = lazy(() => import("@/pages/public/Login"));
const NotFound = lazy(() => import("@/pages/not-found"));

const PortalDashboard = lazy(() => import("@/pages/portal/Dashboard"));
const PortalDocuments = lazy(() => import("@/pages/portal/Documents"));
const PortalPlan = lazy(() => import("@/pages/portal/Plan"));
const PortalMessages = lazy(() => import("@/pages/portal/Messages"));
const PortalBilling = lazy(() => import("@/pages/portal/Billing"));

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminClients = lazy(() => import("@/pages/admin/Clients"));
const AdminClientDetail = lazy(() => import("@/pages/admin/ClientDetail"));
const AdminLeads = lazy(() => import("@/pages/admin/Leads"));
const AdminMessages = lazy(() => import("@/pages/admin/Messages"));
const AdminRevenue = lazy(() => import("@/pages/admin/Revenue"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-8">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ProtectedRoute({
  component: Component,
  adminOnly = false,
}: {
  component: React.ComponentType;
  adminOnly?: boolean;
}) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Redirect to="/portal" />;
  }

  if (!adminOnly && isAdmin) {
    return <Redirect to="/admin" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/tradeline-calculator" component={Calculator} />
        <Route path="/book/confirmation" component={BookConfirmation} />
        <Route path="/book" component={Book} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />

        <Route path="/portal">
          {() => <ProtectedRoute component={PortalDashboard} />}
        </Route>
        <Route path="/portal/documents">
          {() => <ProtectedRoute component={PortalDocuments} />}
        </Route>
        <Route path="/portal/plan">
          {() => <ProtectedRoute component={PortalPlan} />}
        </Route>
        <Route path="/portal/messages">
          {() => <ProtectedRoute component={PortalMessages} />}
        </Route>
        <Route path="/portal/billing">
          {() => <ProtectedRoute component={PortalBilling} />}
        </Route>

        <Route path="/admin">
          {() => <ProtectedRoute component={AdminDashboard} adminOnly />}
        </Route>
        <Route path="/admin/clients">
          {() => <ProtectedRoute component={AdminClients} adminOnly />}
        </Route>
        <Route path="/admin/clients/:id">
          {() => <ProtectedRoute component={AdminClientDetail} adminOnly />}
        </Route>
        <Route path="/admin/leads">
          {() => <ProtectedRoute component={AdminLeads} adminOnly />}
        </Route>
        <Route path="/admin/messages">
          {() => <ProtectedRoute component={AdminMessages} adminOnly />}
        </Route>
        <Route path="/admin/revenue">
          {() => <ProtectedRoute component={AdminRevenue} adminOnly />}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
