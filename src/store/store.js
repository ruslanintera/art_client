import { makeAutoObservable } from "mobx"
import AuthService from "../auth/services/AuthService"
import axios from "axios"
//import { API_URL } from "../auth/http"

export default class Store {
  user = {}
  isAuth = false
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool) {
    this.isAuth = bool
  }

  setUser(user) {
    this.user = user
  }

  setLoading(bool) {
    this.isLoading = bool
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem("token", response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.error("login ERROR", e.response?.data?.message)
    }
  }

  async registration(email, password) {
    try {
      const response = await AuthService.registration(email, password)
      localStorage.setItem("token", response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.error("registration ERROR", e.response?.data?.message)
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout()
      localStorage.removeItem("token")
      this.setAuth(false)
      this.setUser({})
    } catch (e) {
      console.error("logout ERROR", e)
      //console.log(e.response?.data?.message)
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      //console.log("checkAuth", this.user)
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/auth/refresh`,
        {
          withCredentials: true,
        }
      )
      //console.log("checkAuth response", response)
      localStorage.setItem("token", response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
      //console.log("checkAuth user", this.user)
    } catch (e) {
      console.error("checkAuth ERROR", e.response?.data?.message)
    } finally {
      this.setLoading(false)
    }
  }
}
