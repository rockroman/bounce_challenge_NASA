import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'https://bounce-nasa-api-0572a76785eb.herokuapp.com';

export default axios;