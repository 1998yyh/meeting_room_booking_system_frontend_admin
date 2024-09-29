import axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { baseResponse } from "../api/base";


let refreshing = false;

let queue: PendingTask[] = [];



async function refreshToken() {
    const res:baseResponse = await axiosInstance.get('/user/admin/refresh', {
        params: {
            refreshToken: localStorage.getItem('refresh_token')
        }
    })

    if(res.data?.access_token && res.data?.refresh_token){
        localStorage.setItem('access_token', res.data.access_token || '');
        localStorage.setItem('refresh_token', res.data.refresh_token || '');
    }else{
        window.location.href = '/login';
        queue = [];
        refreshing = false;
    }
    
    return res;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost/api',
    timeout: 3000
});

axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
})


interface PendingTask {
    config: AxiosRequestConfig
    resolve: Function
}


axiosInstance.interceptors.response.use(
    (response) => {
        return response.data
    },
    async (error) => {
        
        if (!error.response) {
            return Promise.reject(error)
        }

        const { data, config } = error.response;

        if (refreshing && !config.url.includes('/user/admin/refresh')) {
            return new Promise((resolve) => {
                queue.push({
                    config,
                    resolve
                });
            });
        }

        if (data.code === 401 && !config.url.includes('/user/admin/refresh')) {

            refreshing = true;

            const res = await refreshToken();

            refreshing = false;


            if (res.code === 200 || res.code === 201) {

                queue.forEach(({ config, resolve }) => {
                    resolve(axiosInstance(config))
                })

                return axiosInstance(config);

            } else {

                ElMessage.error(res.data)

                console.log(1111111);

            }

        } else {
            
            return error.response.data;
        }
    }
);



export default axiosInstance