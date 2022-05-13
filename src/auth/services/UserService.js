import $api from "../http";

export default class UserService {
  static fetchUsers(email, password) {
    return $api.get("/users", { email, password });
  }
}
