import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllLeads from "./pages/AllLeads";
import { Toaster } from "react-hot-toast";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              session ? <Navigate to="/" replace /> : <Login />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              session ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/leads"
            element={
              session ? <AllLeads /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  );
}

export default App;