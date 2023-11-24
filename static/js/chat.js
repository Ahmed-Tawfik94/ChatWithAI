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
const chatAI = function () {
  this.chatbox = $("#chatbox");
  this.chatsend = $("#chatsend");
  this.messageCounter=0
};
chatAI.prototype.init = function () {
  const self = this;
  // Event listener for keydown event
  self.chatbox.on("keydown", function (event) {
    // Check for Command (⌘) key and Enter key
    if (event.metaKey && event.key === "Enter") {
      self.sendMessage();
    }
  });

  // Event listener for button click
  self.chatsend.on("click", ()=>self.sendMessage());
};
chatAI.prototype.sendMessage = async function () {
  const message = $("#chatbox").val().trim();
  if (message === "") {
    return;
  }
  this.showMessage('user',message);
  const assistantMessageId = `assistant-${this.messageCounter++}`;
  this.showMessage('assistant','Typing',assistantMessageId);
  let textAssissant = $('#'+assistantMessageId+' .assistantBubble').text();

  this.typed =new Typed(`#${assistantMessageId} .assistantBubble`, { 
    strings: ['Typing', 'Typing.', 'Typing..', 'Typing...'],
    typeSpeed: 50,
    backSpeed: 100,
    showCursor: false,
    loop:true
  });


  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    })

    if (res.status ===200){ 
      const data = await res.json();
      console.log(data)
      mardownToHtml = markdown.makeHtml(data.content);
      this.updateMessage(mardownToHtml,assistantMessageId);
    }else{
      toastr.error('This is an error message', 'Error');
    }
  } catch (error) {
      console.log(error)
      toastr.error('This is an error message', 'Error');
  }
};

chatAI.prototype.showMessage = function (role,message,messageId) {
  const rendered = Mustache.render($("#message-template").html(), {
    message: message,
    isUser: role === "user",
    messageId: messageId,
  });
  // appending the message to the chat body
  $("#chatBody").append(rendered);
  if (role === "user") {
    $("#chatbox").val("");
  }else{
    $("#chatbox").focus();
  }
  $("#chatBody").animate({  scrollTop: $("#chatBody")[0].scrollHeight}, 700);
}
chatAI.prototype.updateMessage = function (content, messageId) {
  this.typed.stop();
  // $('#' + messageId +' .assistantBubble').html(content);
  new Typed(`#${messageId} .assistantBubble`, {
    strings: [content],
    typeSpeed: 10,
    showCursor: false,
  });
  const $parentContainer = $('#chatBody');
    const $childElement = $('#' + messageId +' .assistantBubble');

    // Initialize the initial height
    let lastHeight = $childElement.height();

    // Create a MutationObserver to observe changes in the child element
    const observer = new MutationObserver(() => {
      const newHeight = $childElement.height();

      // Check if the size is increasing
      if (newHeight > lastHeight) {
        // Clear the contents of the child element
        // $childElement.empty();
        let heightToScroll = newHeight - lastHeight;

        // Scroll to the bottom of the parent container
        $parentContainer.animate({  scrollTop: $parentContainer[0].scrollHeight}, 700);

        // Update the last height
        lastHeight = newHeight;
      }
    });

    // Start observing the child element
    observer.observe($childElement[0], { attributes: true, childList: true, subtree: true });
}

const chat = new chatAI();
chat.init();
