const fetch = require('node-fetch');
module.exports =  async function getUserDataFromGoogle(access_token){
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const userData  = await response.json() 
    return userData
}