import { $host } from "../../http";

export default class UserService {
  static fetchUsers(email, password) {
    return $host.get("/api/auth/users");
  }
}
