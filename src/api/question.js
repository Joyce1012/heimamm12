import instance from "@/utils/request.js"
function getQuestionData(params) {
    return instance({
        url: "/question/list",
        method: "get",
        params
    })
}
function addQuestionData(data) {
    return instance({
        url: "/question/add",
        method: "post",
        data
    })
}
function setQuestionData(data) {
    return instance({
        url: "/question/status",
        method: "post",
        data
    })
}
function delQuestionData(data) {
    return instance({
        url: "/question/remove",
        method: "post",
        data
    })
}
function editQuestionData(data) {
    return instance({
        url: "/question/edit",
        method: "post",
        data
    })
}
export { getQuestionData,addQuestionData,setQuestionData,delQuestionData,editQuestionData }