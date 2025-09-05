import "./App.css";
import { Toaster } from "sonner";
import instance from "./interceptor/api";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import Departments from "./pages/Departments/index";
import Auth from "./pages/Auth";
import CourseDetails from "./pages/CourseDetails";
import { setupInterceptors } from "./interceptor/interceptors";
import NotFound from "./pages/NotFound";
import RequireAuth from "./layout/require-auth";
import Layout from "./layout/layout";
import { STUDENT, TEACHER } from "./constants/user";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";

function App() {
  setupInterceptors(instance);

  return (
    <>
      <Toaster position="bottom-center" richColors dismissible theme="system" />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Auth isRegister={false} />} />
          <Route path="register" element={<Auth />} />

          {/* protected routes */}
          <Route element={<RequireAuth allowedRoles={[STUDENT, TEACHER]} />}>
            <Route path="/" element={<Landing />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[TEACHER]} />}>
            <Route path="departments" element={<Departments />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="search" element={<Search />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

          {/* <Route path="*" element  /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
