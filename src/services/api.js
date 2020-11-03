import axios from 'axios'

const api = axios.create({
    baseURL: 'https://mateus-kawazoe-web-2.herokuapp.com'
})

export default api