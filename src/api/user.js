import instance from "@/utils/request.js"
function getUserListDate(params) {
    return instance({
        url: "/user/list",
        method: "get",
        params
    })
}
// 新增数据
function addUserData(data) {
    return instance({
        url: "/user/add",
        method: "post",
        data
    })
}
// 删除
function delUserData(data) {
    return instance({
        url: "/user/remove",
        method: "post",
        data
    })
}
// 状态修改
function setUserStatus(data) {
    return instance({
        url: "/user/status",
        method: "post",
        data
    })
}
// 编辑数据
function editUserData(data) {
    return instance({
        url: "/user/edit",
        method: "post",
        data
    })
}

export { getUserListDate,addUserData,delUserData, setUserStatus, editUserData }