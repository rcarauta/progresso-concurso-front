import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./CustomJwtPayload";

 export const decodeToken = (token: string | null) => {
    try {
      if(token == null) {
        return [];
      }
      const decoded: CustomJwtPayload = jwtDecode(token);
      return decoded.roles || []; 
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return [];
    }
  }

 export const hasAdminRole = (token: string | null) => {
    const roles = decodeToken(token);
    return roles.includes("ROLE_ADMIN");
  };