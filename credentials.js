module.exports = {
    password:process.env.dbpassword,
    username:process.env.dbuser,
    getDBUrl:function(){
        return "mongodb://<dbuser>:<dbpassword>@ds163387.mlab.com:63387/fcc-url-shortener".replace("<dbuser>", this.username).replace("<dbpassword>", this.password);
    }
}