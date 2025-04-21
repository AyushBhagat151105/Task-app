import axios from "axios";
import { data } from "react-router";

class ApiClient {
  constructor() {
    this.baseURl = "http://localhost:3001/api/v1";
    this.defultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async customeFetch(endpoint, options = {}) {
    try {
      const url = `${this.baseURl}${endpoint}`;
      const headers = { ...this.defultHeaders, ...options.headers };
      const config = {
        ...options,
        headers,
        credentials: "include",
      };
      console.log(`Fetching ${url}`);

      const respons = await fetch(url, config);
      const result = await respons.json();

      console.log("API Response Data:", result);
      return result;
    } catch (error) {
      console.error("API ERROR ", error);
      throw error;
    }
  }

  async signup(name, email, password) {
    return this.customeFetch("/users/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });
  }
  async login(email, password) {
    return this.customeFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }
  async verify(token) {
    return this.customeFetch(`/users/verify/:${token}`, {
      method: "GET",
    });
  }
  async dashboard() {
    return this.customeFetch("/users/dashboard", {
      method: "GET",
    });
  }
  async logout() {
    return this.customeFetch("/users/logout", {
      method: "GET",
    });
  }
}

const apiClient = new ApiClient();

export default apiClient;
