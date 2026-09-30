
function User(id,username,password,salt){
    this.id=id;
    this.username=username;
    this.password=password;
    this.salt=salt;
}

export {User};