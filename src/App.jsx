// ---------------Pages---------------------
import Header from "./Components/layout/Header";
import Body from "./pages/Body";
import Login from "./pages/Login";
import Edit from "./pages/Edit";
import SettingsPage from "./pages/SettingsPage";
import HoldingPage from "./pages/HoldingPage";
import Collect from "./pages/Collect";
import SearchPage from "./pages/SearchPage";
import DeletedTasks from "./pages/DeletedTasks";

import WeekdayPage from "./pages/Weekday";
import TrolleyMapper from "./pages/TrolleyMapper";
import TrolleyExportsPage from "./pages/TrolleyExportsPage";
import TrolleyTrackerPage from "./pages/TrolleyTracker";
import TrolleyCustomerDetailsPage from "./pages/TrolleyCustomerDetailsPage";
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
import { Toaster } from "react-hot-toast";
import useAutoRefreshOnIdle from "./hooks/useAutoRefreshOnIdle";
import { useTaskStore } from "./hooks/useTaskStore";
import { getCurrentWeek } from "./utilis/dateUtils";
import ViewExportPage from "./pages/ViewExportPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";
import AcceptTerms from "./pages/auth/AcceptTerms";
import CreateCustomer from "./pages/CreateCustomer";
import { useSettingsStore } from "./hooks/useSettingsStore";
import ViewTask from "./pages/ViewTask";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

export default function App() {
  useAutoRefreshOnIdle();
  const [chosenWeek, setChosenWeek] = useState(getCurrentWeek(new Date()));
  const [chosenYear, setChosenYear] = useState(2026);
  const [edit, setEdit] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const isAuthenticated = useAuth();
  const {
    loading,
    startPollingWithImmediateFetch,
    stopPolling,
    debouncedFetchTasks,
  } = useTaskStore();

  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const settings = useSettingsStore((state) => state.settings);

  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  // // Initial fetch of data - when the user logs in (is authenticated) fetch the data and start polling
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchSettings();
  //     startPollingWithImmediateFetch({ week: chosenWeek, year: chosenYear });
  //   } else {
  //     stopPolling(); //user logged out, stop polling
  //   }
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   fetchTasks({ week: chosenWeek, year: chosenYear });
  // }, [chosenWeek, chosenYear, fetchTasks]);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      stopPolling();
      return;
    }

    // (optional) only fetch settings once or guard it
    // fetchSettings();

    // one call covers initial + any week/year changes
    startPollingWithImmediateFetch({ week: chosenWeek, year: chosenYear });

    // clean up on unmount / auth change
    return () => stopPolling();
  }, [isAuthenticated, chosenWeek, chosenYear]);

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
            <div
              className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm
               flex flex-col items-start justify-center"
              role="status"
              aria-live="polite"
              aria-label="Loading"
            >
              <DanishTrolleyLoader />
            </div>
          )}
          <div className="sticky top-0 z-50 col-start-1 col-end-6 row-start-1 row-end-2 bg-white">
            <Header
              setChosenWeek={setChosenWeek}
              setChosenYear={setChosenYear}
              setEdit={setEdit}
              edit={edit}
              setCustomerList={setCustomerList}
              year={chosenYear}
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
                path="/holding-page"
                element={
                  <ProtectedRoute>
                    <HoldingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trolley-tracker"
                element={
                  <ProtectedRoute>
                    <TrolleyTrackerPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />

              <Route
                path="/logs"
                element={
                  <ProtectedRoute roles="admin">
                    <DeletedTasks />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trollies/customer/:id"
                element={
                  <ProtectedRoute>
                    <TrolleyCustomerDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/delivery-runs"
                element={
                  <ProtectedRoute>
                    <TrolleyExportsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/settings" element={<SettingsPage />} />

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
                path="/view/:id"
                element={
                  <ProtectedRoute>
                    <ViewTask />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-customer"
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
              <Route
                path="/resend-verification"
                element={<ResendVerification />}
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
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                // Default fallback for unauthenticated users
                // <Login />
                <LandingPage />
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
}
