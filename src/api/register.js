import instance from "@/utils/request.js"

function getPhoneCode(data) {
    return instance({
        url: "/sendsms",
        method: "post",
        data
    })
   
}

function register(data) {
    return instance({
        url:"/register",
        method: "post",
        data,
    })
}

export  {getPhoneCode,register}