import axios from 'axios'



const _publicRequest = axios.create({
    baseURL:process.env.REACT_APP_BASE_URL_SERVER
})

const _userRequest = axios.create({
    baseURL:process.env.REACT_APP_BASE_URL_SERVER
})


_userRequest.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      // For example, add an authorization token to the headers
      const accessToken = JSON.parse(localStorage.getItem('user'))?.data?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  
  // Set up a response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Do something with the response data
      return response;
    },
    (error) => {
      // Do something with response error
      return Promise.reject(error);
    }
  );





export {_publicRequest,_userRequest}