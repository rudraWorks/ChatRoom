
const generateMessage =(message,username) =>{
    let dt = new Date().getTime()

    return {message:message,timestamp:dt,username:username}
}

module.exports ={generateMessage}