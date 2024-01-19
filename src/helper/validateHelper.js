export const validateEmail = (email)=> {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

export const validateEmpty = (value)=>{
    if(value?.trim().length === 0){
        return true;
    }
    return false; 
}


export const validateMinLenght = (value,length)=>{
    if(value?.trim().length < length){
        return true; 
    }
    return false; 
}


export const validateMaxLenght = (value,length)=>{
    if(value?.trim().length > length){
        return true; 
    }
    return false; 
}


export const validateDate = (inputDate)=>{
    var enteredDate = new Date(inputDate);
    var currentDate = new Date();
    return enteredDate >= currentDate;
}