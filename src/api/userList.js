import instance from "@/utils/request.js"
function getUserListDate(params) {
    return instance({
        url: "/user/list",
        method: "get",
        params
    })
}

export { getUserListDate }