function getFullName(firstName:string, lastName:string, middleName?:string){
    return firstName + " " + (middleName ?? "") + " " + lastName;
}

export default getFullName; 