import React, { useEffect, useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import { getSecureLocalStorage } from "./SecureLocalStorage";

export const ProtectedRoute = (props: any) => {
  const { Roles } = props;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserInRole = (roles: any) => {
    if (roles == null) {
      return true;
    }
    if (roles.split(",").includes(getSecureLocalStorage("role"))) {
      return true;
    } else {
      return false;
    }
  };

  const checkUserToken = () => {
    const userToken = getSecureLocalStorage("token");
    if (!userToken || userToken === "undefined" || !checkUserInRole(Roles)) {
      setIsLoggedIn(false);
      return navigate("/login");
    }
    setIsLoggedIn(true);
  };
  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);
  return <>{isLoggedIn ? props.children : null}</>;
};

export const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
