import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { getSecureLocalStorage, setSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { toast } from "react-toastify";
const scope = process.env.REACT_APP_SCOPE;

export const useGoogleAuth = () => {
  const [accessToken, setAccessToken] = useState(getSecureLocalStorage("accessToken"));
  const [tokenExpiry, setTokenExpiry] = useState(getSecureLocalStorage("tokenExpiry"));

  const handleLoginSuccess = (tokenResponse:any) => {
    const accessToken = tokenResponse.access_token;
    const expiryDate = new Date().getTime() + tokenResponse.expires_in * 1000;
    setAccessToken(accessToken);
    setTokenExpiry(expiryDate.toString());
    setSecureLocalStorage("accessToken", accessToken);
    setSecureLocalStorage("tokenExpiry", expiryDate.toString());
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (errorResponse) => {
      console.error("Login failed", errorResponse);
      toast.error("Google login failed!");
    },
    scope: scope,
  });

  const checkTokenValidity = () => {
    if (!accessToken || !tokenExpiry) return false;
    return new Date().getTime() < parseInt(tokenExpiry);
  };

  return { accessToken, checkTokenValidity, login };
};
