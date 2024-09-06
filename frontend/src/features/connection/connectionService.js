import axios from "axios";
const API_URL = "api/connection"
export const checkConnection = async () => {
  try {
    const response = await axios.get(API_URL, {})
    if (response.data) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  } catch (error) {
    return error
  }

}
export const getLanguage = async () => {
  const response = await axios.get(API_URL + "/" + "language", {});
  return response.data
}
const connectionService = {
  checkConnection, getLanguage
}
export default connectionService 