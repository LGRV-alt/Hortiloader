import Header from "./Components/Header";
import Body from "./Components/Body";

import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login";
import { isUserValid } from "./Components/lib/pocketbase";

import Edit from "./templates/Edit";
import SettingsPage from "./templates/SettingsPage";
import HoldingPage from "./templates/HoldingPage";
import Collect from "./templates/Collect";
import SearchPage from "./templates/SearchPage";
import CreateCustomer from "./Components/CreateCustomer";
import WeekdayPage from "./templates/Weekday";
import TrolleyMapper from "./templates/TrolleyMapper";
import useTasks from "./hooks/useTasks";

import useAuth from "./hooks/useAuth";
import TrolleyExportsPage from "./templates/TrolleyExportsPage";
import ViewExportPage from "./templates/ViewExportPage";
import { setTodayAsLoginDate, shouldClearAuthDaily } from "./hooks/authHelpers";
import pb from "./Components/lib/pbConnect";
import { useUserSettings } from "./hooks/useUserSettings";
import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "./templates/ForgotPassword";
import ResetPassword from "./templates/ResetPassword";
import AuthRedirect from "./Components/AuthRedirect";
import VerifyEmail from "./templates/VerifyEmail";
import Terms from "./templates/Terms";
import Privacy from "./templates/Privacy";
import ResendVerification from "./templates/ResendVerification";
import AcceptTerms from "./templates/AcceptTerms";
import ProtectedRoute from "./Components/ProtectedRoute";
import useAutoRefreshOnIdle from "./hooks/useAutoRefreshOnIdle";
import DanishTrolleyLoader from "./Components/DanishTrolleyLoader";

import { useTaskStore } from "./hooks/useTaskStore";

export default function App() {
  useAutoRefreshOnIdle();
  const [chosenWeek, setChosenWeek] = useState(getCurrentWeek(new Date()));
  const [chosenYear, setChosenYear] = useState(2025);
  const [edit, setEdit] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const {
    settings,
    updateSettings,
    loading: settingsLoading,
  } = useUserSettings();

  const isAuthenticated = useAuth();

  // const { tasks: rec, refetch } = useTasks();

  const { tasks, loading, subscribeToTasks } = useTaskStore();

  useEffect(() => {
    if (isAuthenticated) {
      subscribeToTasks();
    }
  }, [isAuthenticated, subscribeToTasks]);

  function getCurrentWeek(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return weekNo;
    // return [d.getUTCFullYear(), weekNo];
  }

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
            <div className="absolute inset-0 bg-white/60 z-50 pt-20 flex flex-col items-center justify-center pointer-events-auto">
              <h2 className="text-4xl font-bold mb-8">Fetching Orders...</h2>
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute left-0  -translate-y-1/2">
                  <DanishTrolleyLoader />
                </div>
              </div>
            </div>
          )}
          {/* <div className="col-start-1 col-end-6 row-start-1 row-end-2"> */}
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
              {/* Holding Page */}
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
