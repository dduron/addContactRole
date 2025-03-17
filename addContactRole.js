require("dotenv").config()
const axios = require('axios');

const addContactRole = async (contactRoleName) => {
  //Configuring parameters to retrieve access token
  const options = {
    url: "https://accounts.zoho.com/oauth/v2/token",
    method: "post",
    params: {
      //Retrieving data from .env file       
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: process.env.REFRESH_TOKEN,
      grant_type: "refresh_token",
    },
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  try {
    //Retrieving access token
    const responseRefreshToken = await axios(options);
    
    if(responseRefreshToken.data.access_token) {
      const accessToken = responseRefreshToken.data.access_token;
      //Adding contact role name
      const response = await axios.post(
        'https://www.zohoapis.com/crm/v7/Contacts/roles', 
        {
          contact_roles: [
            {
              name: contactRoleName
            }
          ]          
        },
        {
          headers: { 
            Authorization: `Zoho-oauthtoken ${accessToken}`
          },
        }
      );
      console.log(JSON.stringify(response.data));
    } else {
      console.log('Error retrieving access token:', JSON.stringify(responseRefreshToken.data));
    }  
  } catch (error) {
    console.log(error);
  }
}

if(!process.env.CLIENT_ID) {
  console.log("CLIENT_ID not found in .env file");
} else if (!process.env.CLIENT_SECRET) {
  console.log("CLIENT_SECRET not found in .env file");
} else if (!process.env.REFRESH_TOKEN) {
  console.log("REFRESH_TOKEN not found in .env file");
} else {
  addContactRole("New Contact Role Name");
}