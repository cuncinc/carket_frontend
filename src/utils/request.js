import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  // timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    // console.log(config);
    // app.$vux.loading.show({
    //   text: "数据加载中……",
    // });
    // config.method === "post"
    //   ? (config.data = qs.stringify({ ...config.data }))
    //   : (config.params = { ...config.params });
    // config.headers["Content-Type"] = "application/x-www-form-urlencoded";

    let isAccountLogin = localStorage.isAccountLogin;
    if (isAccountLogin) {
      let token = localStorage.token;
      Cookies.set("token", token);
      if (token) {
        // console.log(token);
        config.headers["token"] = token;
      }
    }
    return config;
  },
  (error) => {
    //请求错误处理
    // app.$vux.toast.show({
    //   type: "warn",
    //   text: error,
    // });

    Promise.reject(error);
  }
);

// // 响应拦截器
// service.interceptors.response.use(
//   (response) => {
//     // //成功请求到数据
//     // app.$vux.loading.hide();
//     // //这里根据后端提供的数据进行对应的处理
//     // if (response.data.result === "TRUE") {
//     //   return response.data;
//     // } else {
//     //   app.$vux.toast.show({
//     //     //常规错误处理
//     //     type: "warn",
//     //     text: response.data.data.msg,
//     //   });
//     // }

//     return Promise.reject(response);
//   },
//   (error) => {
//     //响应错误处理console.log('error');
//     // console.log(error);
//     // console.log(JSON.stringify(error));
//     // let text =
//     //   JSON.parse(JSON.stringify(error)).response.status === 404
//     //     ? "404"
//     //     : "网络异常，请重试";
//     // app.$vux.toast.show({
//     //   type: "warn",
//     //   text: text,
//     // });
//     return Promise.reject(error);
//   }
// );

export default service;