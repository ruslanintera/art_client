import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { common } from "../common/common";

// registration_WORK
export const registration_WORK = async (email, password) => {
  const { data } = await $host.post("api/auth/registration", {
    email,
    password,
    role: "ADMIN",
  });

  //console.log("datadatadatadatadatadatadata =============", data)

  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};
// registration_WORK
export const registration = async (email, password) => {
  try {
    const response = await $host.post("api/auth/registration", {
      email,
      password,
      role: "ADMIN",
    });
    const data = response.data;
    //console.log("datadatadatadatadatadatadata =============", data)

    localStorage.setItem("token", data.token);

    //console.log("333 responseresponseresponseresponseresponseresponserespons =============", response)

    return jwt_decode(data.token);
  } catch (e) {
    common.coi_sys("Registration ERROR", e);
    alert(e.response.data.message); // Пользователь с таким email уже существует
  }
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get("api/auth/auth");
  localStorage.setItem("token", data.token);
  return jwt_decode(data.token);
};
