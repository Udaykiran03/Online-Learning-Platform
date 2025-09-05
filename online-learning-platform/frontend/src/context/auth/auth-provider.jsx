import { createContext, useEffect, useState } from "react";
import LocalStorageRepository from "../../../lib/storage";
import { decodeAndValidateToken } from "../../../lib/utils";
import { STUDENT, TEACHER } from "../../constants/user";
import studentService from "../../services/studentService";
import teacherService from "../../services/teacherService";
import { Loading } from "../../pages/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: false });
  const token = LocalStorageRepository.get("token");

  const getUpdatedUser = (user) => {
    if (user.type === STUDENT) {
      studentService
        .getStudentById(user?._id)
        .then((res) =>
          setAuth((prev) => ({ ...prev, user: res, loading: false }))
        )
        .finally(() => setAuth((prev) => ({ ...prev, loading: false })));
    } else {
      teacherService
        .getTeacherById(user?._id)
        .then((res) =>
          setAuth((prev) => ({ ...prev, user: res, loading: false }))
        )
        .finally(() => setAuth((prev) => ({ ...prev, loading: false })));
    }
  };

  useEffect(() => {
    setAuth((prev) => ({ ...prev, loading: true }));
    const checkAuthentication = () => {
      if (token && !auth.user) {
        const { isValidToken, decodedToken } = decodeAndValidateToken(token);
        if (isValidToken) {
          getUpdatedUser(decodedToken.user);
          // setAuth({ user: decodedToken.user });
        } else {
          setAuth({ user: null, loading: false });
        }
      } else {
        setAuth({ user: null, loading: false });
      }
    };

    checkAuthentication();
  }, [token]);

  if (auth?.loading) return <Loading />;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
