import $api from "../http";

export default class UserService {
  static fetchUsers(email, password) {
    console.log("121 email, password = ", email, password);
    //return $api.get("/users", { email, password });
    return $api.get("/users");
  }
}
