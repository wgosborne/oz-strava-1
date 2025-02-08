//may not need this file

// import { useState, useEffect } from "react";
// import RefreshReadAcessToken from "../api/refreshToken";

// const useAuth = () => {
//   const [accessToken, setAccessToken] = useState(null);

//   // A mock function to get a refresh token (this could be from a cookie or context)
//   const getRefreshToken = () => {
//     return localStorage.getItem("refresh_token");
//   };

//   useEffect(() => {
//     const refreshIfNeeded = async () => {
//       const refreshToken = getRefreshToken();
//       if (!refreshToken) return; // No refresh token found

//       try {
//         const newAccessToken = await RefreshReadAcessToken(refreshToken);
//         setAccessToken(newAccessToken);
//         // Optionally store the new access token in localStorage or cookies
//         localStorage.setItem("access_token", newAccessToken);
//         console.log(newAccessToken);
//       } catch (error) {
//         console.error("Failed to refresh access token:", error);
//       }
//     };

//     // Check token expiration or other conditions here
//     refreshIfNeeded();
//   }, []);

//   return accessToken;
// };

// export default useAuth;
