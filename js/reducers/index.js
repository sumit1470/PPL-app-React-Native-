const initialState = {
    post: [],
    categories: [],
    remember: ""
}

export function rootReducer(state = initialState, action){
    if(action.type === "POST_UPLOADED"){
        return Object.assign({},state,{
            post: [...action.payload]
        })
    }

    else if(action.type === 'CATEGORY_UPLOADED'){
        return Object.assign({},state,{
            categories: action.payload
        })
    }

    else if(action.type === "SET_REMEMBER"){
        // console.log("remember value changed")
        return Object.assign({},state,{
            remember: action.payload
        })
    }
    return state;
}