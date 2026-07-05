import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";

import Home from "@/pages/public/Home";
import Services from "@/pages/public/Services";
import Calculator from "@/pages/public/Calculator";
import Book from "@/pages/public/Book";
import Contact from "@/pages/public/Contact";
import Login from "@/pages/public/Login";

import PortalDashboard from "@/pages/portal/Dashboard";
import PortalDocuments from "@/pages/portal/Documents";
import PortalPlan from "@/pages/portal/Plan";
import PortalMessages from "@/pages/portal/Messages";
import PortalBilling from "@/pages/portal/Billing";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import AdminClientDetail from "@/pages/admin/ClientDetail";
import AdminLeads from "@/pages/admin/Leads";
import AdminMessages from "@/pages/admin/Messages";
import AdminRevenue from "@/pages/admin/Revenue";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/tradeline-calculator" component={Calculator} />
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
