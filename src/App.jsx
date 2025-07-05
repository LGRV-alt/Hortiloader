// ---------------Pages---------------------
import Header from "./Components/layout/Header";
import Body from "./pages/Body";
import Login from "./pages/Login";
import Edit from "./pages/Edit";
import SettingsPage from "./pages/SettingsPage";
import HoldingPage from "./pages/HoldingPage";
import Collect from "./pages/Collect";
import SearchPage from "./pages/SearchPage";
import CreateCustomer from "./Components/CreateCustomer";
import WeekdayPage from "./pages/Weekday";
import TrolleyMapper from "./pages/TrolleyMapper";
import TrolleyExportsPage from "./pages/TrolleyExportsPage";

import ResetPassword from "./pages/auth/ResetPassword";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import AuthRedirect from "./Components/AuthRedirect";
import ProtectedRoute from "./Components/ProtectedRoute";
import DanishTrolleyLoader from "./Components/DanishTrolleyLoader";

// -------------------Functions ------------------
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "./hooks/useAuth";
import { useUserSettings } from "./hooks/useUserSettings";
import { Toaster } from "react-hot-toast";
import useAutoRefreshOnIdle from "./hooks/useAutoRefreshOnIdle";
import { useTaskStore } from "./hooks/useTaskStore";
import { getCurrentWeek } from "./utilis/dateUtils";
import ViewExportPage from "./pages/ViewExportPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";
import AcceptTerms from "./pages/auth/AcceptTerms";

export default function App() {
  useAutoRefreshOnIdle();
  const [chosenWeek, setChosenWeek] = useState(getCurrentWeek(new Date()));
  const [chosenYear, setChosenYear] = useState(2025);
  const [edit, setEdit] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const { settings, fetchSettings } = useUserSettings();
  const isAuthenticated = useAuth();
  const { loading, startPollingWithImmediateFetch, stopPolling } =
    useTaskStore();

  // Initial fetch of data - when the user logs in (is authenticated) fetch the data and start polling
  useEffect(() => {
    if (isAuthenticated) {
      startPollingWithImmediateFetch();
    } else {
      stopPolling(); //user logged out, stop polling
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (settingsChanged) {
      fetchSettings().then(() => setSettingsChanged(false));
    }
  }, [settingsChanged]);

  return (
    <>
      <Toaster
        position="bottom-center"
        containerStyle={{
          top: 80,
        }}
      />
      {isAuthenticated ? (
        <div className="relative grid-cols-[1fr_10fr] grid-rows-[60px_10fr] grid w-screen h-dvh overflow-x-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white z-50 pt-20 flex flex-col items-center justify-center pointer-events-auto">
              <h2 className="text-4xl font-bold mb-8">Fetching Orders...</h2>
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute left-0  -translate-y-1/2">
                  <DanishTrolleyLoader />
                </div>
              </div>
            </div>
          )}
          <div className="sticky top-0 z-50 col-start-1 col-end-6 row-start-1 row-end-2 bg-white">
            <Header
              setChosenWeek={setChosenWeek}
              setChosenYear={setChosenYear}
              setEdit={setEdit}
              edit={edit}
              setCustomerList={setCustomerList}
            />
          </div>
          <div className="bg-white col-start-1 col-end-4 row-start-2 row-end-3">
            <Routes>
              {/* Main Page */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Body
                      // records={rec}
                      chosenWeek={chosenWeek}
                      chosenYear={chosenYear}
                      edit={edit}
                      setCustomerList={setCustomerList}
                      customerList={customerList}
                      userSettings={settings}
                      loading={loading}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/holdingPage"
                element={
                  <ProtectedRoute>
                    <HoldingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/runs"
                element={
                  <ProtectedRoute>
                    <TrolleyExportsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <SettingsPage
                    onSettingsChange={() => setSettingsChanged(true)}
                  />
                }
              />

              <Route
                path="/runs/view/:id"
                element={
                  <ProtectedRoute>
                    <ViewExportPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trolley-mapper"
                element={
                  <ProtectedRoute>
                    <TrolleyMapper customerList={customerList} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/weekday/:year/:week/:day/:number"
                element={
                  <ProtectedRoute>
                    <WeekdayPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/accept-terms" element={<AcceptTerms />} />

              <Route
                path="/collect"
                element={
                  <ProtectedRoute>
                    <Collect chosenWeek={chosenWeek} chosenYear={chosenYear} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <Edit />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/createCustomer"
                element={
                  <ProtectedRoute>
                    <CreateCustomer />
                  </ProtectedRoute>
                }
              />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/auth/confirm-password-reset/:token"
                element={<ResetPassword />}
              />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="grid-cols-1 grid w-screen h-dvh overflow-x-hidden">
          <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/auth/confirm-password-reset/:token"
              element={<ResetPassword />}
            />
            <Route
              path="/auth/confirm-verification/:token"
              element={<VerifyEmail />}
            />
            <Route
              path="/resend-verification"
              element={<ResendVerification />}
            />
            <Route path="/_/" element={<AuthRedirect />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/accept-terms" element={<AcceptTerms />} />
            <Route
              path="*"
              element={
                // Default fallback for unauthenticated users
                <Login />
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
}
