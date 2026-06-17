import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase"
import {BrowserRouter, Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AllLeads from "./pages/AllLeads"
import { Toaster } from "react-hot-toast";


function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  //get current session and listen for login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, []);

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (!session) {
    return <Login />
  }

  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
          />

        <Route
          path="/leads"
          element={<AllLeads />}
          />
      </Routes>
    </BrowserRouter>
          </>
  )
}

export default App