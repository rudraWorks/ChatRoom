const socket =  io({transports: ['websocket'], upgrade: false});

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
const messageBox = document.getElementById('messageBox')
const sendMessageForm = document.getElementById('sendMessageForm')

socket.emit('join',{username,room},(error)=>{
        if(error)
        {
            alert('A person with this username already exist in this room!')
            location.href='/'
        }

       
})

socket.on('roomInformation',({room,allUsers})=>{

    let participants = document.getElementById('participants')
    participants.innerHTML=""
    document.getElementById('roomName').textContent=room
    document.getElementById('roomName').style.background="lightgreen"
    let ul = document.createElement('ul')

    for(let i=0;i<allUsers.length;++i)
    {
        let li = document.createElement('li')
        li.textContent=allUsers[i].username 
        li.style.color="yellow"
        li.style.fontFamily="courier new"
        ul.appendChild(li)
    }
    participants.appendChild(ul)
    console.log(room)
    console.log(allUsers)
})

socket.on('setCurrentUser',(currentUser)=>{
    let currUser=document.getElementById('currentUser')
    currUser.style.fontWeight="100"
    currUser.textContent=currentUser
    currUser.style.background="red"
})


socket.on('message',(message)=>{
    let p = document.createElement('p')
    p.innerHTML="<div style='background:aqua; padding:5px'><h4>"+message.username+" at "+moment(message.timestamp).format('hh:mm:ss A')+"</h4><h2><i>"+message.message+"</i></h2></div><br>"
    messageBox.appendChild(p)
    
    scrollToBottom(messageBox);
})

sendMessageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const msg = sendMessageForm.message.value
    sendMessageForm.message.value=""
    socket.emit('messageFromUser',msg)  
})

const scrollToBottom = (node) => {
	node.scrollTop = node.scrollHeight;
}
