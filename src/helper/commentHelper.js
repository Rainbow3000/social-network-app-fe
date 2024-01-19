

export const findComment = (comment,commentId,data)=>{
    if(comment._id === commentId){
        comment.children = data; 
        return; 
    }

    if(comment.children?.length > 0){
        comment.children.forEach(element =>{
            findComment(element,commentId,data); 
        })
    }

}

export const addComment = (comment,parentId,data)=>{
    if(comment._id === parentId){
        comment.children =[...comment.children,data]; 
        return; 
    }

    if(comment.children?.length > 0){
        comment.children.forEach(element =>{
            addComment(element,parentId,data); 
        })
    }

}

export const removeTreeComment = (comment,parentId,commentId)=>{
    if(comment._id === parentId){
        comment.children = comment.children.filter(item => item._id !== commentId); 
        return; 
    }

    if(comment.children?.length > 0){
        comment.children.forEach(element =>{
            removeTreeComment(element,parentId,commentId); 
        })
    }

}