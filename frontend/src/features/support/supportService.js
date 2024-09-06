import axios from "axios";

const API_URL = "api/support"
export const add = async (recaptchaToken, subject, description) => {

  let token = localStorage.getItem("token")
  if (token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, {
      recaptchaToken, subject, description
    }, config)

    return response.data
  } else {
    return null
  }
}

const supportService = {
  add,
}
export default supportService 