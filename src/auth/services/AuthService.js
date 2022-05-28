import { $host } from "../../http";
//import $host from "../http";
//import { AxiosResponse } from "axios";
//import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
  static async login(email, password) {
    return $host.post("/api/auth/login", { email, password });
  }

  static async registration(email, password) {
    return $host.post("/api/auth/registration", { email, password });
  }

  static async logout() {
    //console.log("00000000000000 auth service logout 67676");
    return $host.post("/api/auth/logout");
  }
}
