import $api from "../http";
//import { AxiosResponse } from "axios";
//import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
  static async login(email, password) {
    return $api.post("/login", { email, password });
  }

  static async registration(email, password) {
    return $api.post("/registration", { email, password });
  }

  static async logout() {
    //console.log("00000000000000 auth service logout 67676");
    return $api.post("/logout");
  }
}
