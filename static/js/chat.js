// Path: static/js/chat.js
/*
TODO: 1. get message element
2.get send button element
3. get message from input element
4. send message to server
5. get response from server
6. display response
7. clear input element
8. repeat 3-7
**/
const chatAI=function(){
this.messages = [];
this.chatbox=$("#chatbox");
this.chatsend=$("#chatsend");
}
chatAI.prototype.init=function(){
    const self=this;
      // Function to send the message
    
    // Event listener for keydown event
    this.chatbox.on('keydown', function(event) {
        // Check for Command (⌘) key and Enter key
        if (event.metaKey && event.key === 'Enter') {
            self.sendMessage();
        }
    });

    // Event listener for button click
    this.chatsend.on('click', self.sendMessage);
    }
chatAI.prototype.sendMessage= async function() {
const message = $('#chatbox').val().trim();
if (message === '') {
    return;
}  
const msg = {message:message,role:'user'}
// this.messages.push(msg);
const El=Mustache.render($('#message-template').html(), {message:msg.message,isUser:msg.role === 'user'});
 // Add your logic to send the message here
$('#chatBody').append(El);
// this.displayMessage(message);
$('#chatbox').val('');
fetch('/api/chat',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
        body:JSON.stringify({message:message})
    }).then(res=>res.json()).then(data=>{
        console.log(data);
        let messageToHtml=markdown.makeHtml(data.content);
        // this.messages.push(data);
        const El=Mustache.render($('#message-template').html(), {message:messageToHtml,isUser:data.role === 'user'});
        // Add your logic to send the message here
        $('#chatBody').append(El);
    }).catch(err=>{
        console.log(err);
    })
    // testRole=!testRole;
    // const msg={
    //     message:message,
    //     role:testRole

    // }
}


const chat=new chatAI();
chat.init();