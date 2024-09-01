import axios from "axios";
const API_URL = "api/connection/"
export const checkConnection = async () => {
    const response = await axios.get(API_URL, {});
    return response.data
}
export const getLanguage = async () => {
  const response = await axios.get(API_URL+"language", {});
  return response.data
}
const connectionService = {
    checkConnection,getLanguage
  }
export default connectionService 