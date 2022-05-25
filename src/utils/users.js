const Users = [] 

// addUser, removeUser, getUser, getUsersInRoom 

const checkIfExisting = (id,username,room) =>{
    
    for(let i=0;i<Users.length;++i)
    {
        if(Users[i].username==username && Users[i].room==room)
        return 1;
    }
    return 0;
}

const addUser = (id,username,room) => {

    if(checkIfExisting(id,username,room))
    {
        return 0;
    }
    Users.push({id,username,room})
    return 1;
}

const removeUser = (id) =>{
    let index = Users.findIndex((user)=>user.id==id)
    if(index!=-1)
    {
        return Users.splice(index,1)[0]
    }
    return -1
}

const getUser = (id) =>{

    for(let i=0;i<Users.length;++i)
    {
        if(Users[i].id==id)
        return Users[i];
    }
    return 0;
}

const getUsersInRoom = (room) =>{
    
    let ans=[]
    for(let i=0;i<Users.length;++i)
    {
       if(Users[i].room==room)
       ans.push(Users[i])
    }
    return ans;
}

module.exports ={addUser,removeUser,getUser,getUsersInRoom}