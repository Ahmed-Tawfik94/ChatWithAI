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
chatAI.prototype.sendMessage=function() {
const message = $('#chatbox').val();
console.log('Sending message:', message);
const temp=`<div class="d-flex justify-content-end">
<div class="d-flex justify-content-between align-items-center">
    <div class="card border border-1 mb-2" style="max-width:600px ;">
        <div class="card-body p-2">
            <p class="card-text">${message}</p>
        </div>
    </div>
    <span style="width:36px; height:36px" class="px-1 mx-1 rounded-circle bg-warning d-flex justify-content-center align-items-center ">
        <i class=" fa-solid fa-user fa-lg"></i>
    </span>
</div>
</div>`
$('#chatBody').append(temp);
// Add your logic to send the message here
}


const chat=new chatAI();
chat.init();