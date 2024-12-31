import { jwtDecode } from "jwt-decode";

 export const decodeToken = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.roles || []; 
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return [];
    }
  }

 export const hasAdminRole = (token: string) => {
    const roles = decodeToken(token);
    return roles.includes("ROLE_ADMIN");
  };