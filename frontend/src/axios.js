import axios from 'axios'

/*******************************************************************************
 * Axios interceptors
 * Set the authorization token and change the url if deploying the app to Heroku
 *******************************************************************************/

axios.interceptors.request.use((config) => {
  config.baseURL = 'https://sporterapp.herokuapp.com'
  // config.baseURL = 'http://localhost:5000'
  const token = localStorage.getItem('jwtToken')
  config.headers.common['Authorization'] = `Bearer ${token}`
  return config
})

export const baseURL = 'https://sporterapp.herokuapp.com'
// export const baseURL = 'http://localhost:5000'

export default axios
