import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      return await this.account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error("AuthService :: createAccount ::", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("AuthService :: login ::", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("AuthService :: getCurrentUser ::", error);
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.error("AuthService :: logout ::", error);
      throw error;
    }
  }

  async updatePrefs(prefs) {
    try {
      return await this.account.updatePrefs(prefs);
    } catch (error) {
      console.error("AuthService :: updatePrefs ::", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
