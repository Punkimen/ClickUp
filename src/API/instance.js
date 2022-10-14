import axios from "axios";

export const instance = axios.create({
  baseURL: 'https://hookb.in/eK160jgYJ6UlaRPldJ1P',
  headers: {
    "Content-Type": "application/json"
  }
});