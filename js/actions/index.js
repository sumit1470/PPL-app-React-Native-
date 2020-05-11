export function postUploaded(payload){
    return {
        type: "POST_UPLOADED",
        payload
    }
}

export function categoryUploaded(payload){
    return {
        type: "CATEGORY_UPLOADED",
        payload
    }
}

export function setRemember(payload){
    return {
        type: "SET_REMEMBER",
        payload
    }
}