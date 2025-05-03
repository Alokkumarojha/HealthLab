// src/appwrite/config.js
import { Client, Account, Databases, ID, Storage } from "appwrite";
import conf from "../conf/conf";

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client); // ✅

export { client, account, databases, ID, storage }; 
