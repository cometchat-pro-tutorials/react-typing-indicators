import React from 'react';
import {CometChat} from '@cometchat-pro/chat';
import {ChatBox} from 'react-chatbox-component';

const {REACT_APP_COMETCHAT_GUID} = process.env;

class Chat extends React.Component {
  constructor(props) {
    super();
    this.state = {
      messages: [],
      isLoading: true,
      user: props.user,
      currentlyTyping: [],
    };
  }

  componentDidMount() {
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(REACT_APP_COMETCHAT_GUID)
      .setLimit(20)
      .build();

    messagesRequest.fetchPrevious().then(
      messages => {
        this.setState({
          messages: messages,
          isLoading: false,
        });
      },
      error => {
        console.log('Message fetching failed with error:', error);
      }
    );

    CometChat.addMessageListener(
      'CC-LISTENER-ID',
      new CometChat.MessageListener({
        onTextMessageReceived: message => {
          const {messages} = this.state;
          console.log('Incoming Message Log', {message});
          messages.push(message);
          this.setState({
            messages,
          });
        },
        onTypingStarted: typingIndicator => {
          console.log('Typing started :', typingIndicator);
          const {currentlyTyping} = this.state;
          const {sender} = typingIndicator;
          if (currentlyTyping.length > 0) {
            if (!currentlyTyping.some(element => element.uid === sender.uid)) {
              currentlyTyping.push(sender);
            }
          } else {
            currentlyTyping.push(sender);
          }
          this.setState({
            currentlyTyping,
          });
        },
        onTypingEnded: typingIndicator => {
          console.log('Typing ended :', typingIndicator);
          const {currentlyTyping} = this.state;
          const {sender} = typingIndicator;
          const newCurrentlyTyping = currentlyTyping.filter(
            element => element.uid !== sender.uid
          );
          this.setState({
            currentlyTyping: newCurrentlyTyping,
          });
        },
      })
    );
  }

  typingListener = () => {
    const receiverId = REACT_APP_COMETCHAT_GUID;
    const receiverType = CometChat.RECEIVER_TYPE.GROUP;

    const typingNotification = new CometChat.TypingIndicator(
      receiverId,
      receiverType
    );
    console.log('Sending typing notification to listener');
    CometChat.startTyping(typingNotification);
  }

  componentWillUnmount() {
    CometChat.removeMessageListener('CC-LISTENER-ID');
  }

  handleSendMessage = message => {
    if(message){
      const textMessage = new CometChat.TextMessage(
        REACT_APP_COMETCHAT_GUID,
        message,
        CometChat.MESSAGE_TYPE.TEXT,
        CometChat.RECEIVER_TYPE.GROUP
      );
  
      CometChat.sendMessage(textMessage).then(
        message => {
          const {messages} = this.state;
          messages.push(message);
          this.setState({
            messages,
          });
          console.log('Message sent successfully:', message);
        },
        error => {
          console.log('Message sending failed with error:', error);
        }
      );
    }
  };

  scrollToBottom = () => {
    const chat = document.getElementById('end-of-chat');
    chat.scrollIntoView();
  };

  render() {
    const {messages, isLoading, user, currentlyTyping} = this.state;

    const typingAnimation = (
      <React.Fragment>
        <span className='typing-dot'></span>
        <span className='typing-dot'></span>
        <span className='typing-dot'></span>
      </React.Fragment>
    );
    let typingText = '';
    if (currentlyTyping.length === 1) {
      typingText = `${currentlyTyping[0].name} is typing `;
    } else if (currentlyTyping.length === 2) {
      typingText = `${currentlyTyping[0].name} and ${currentlyTyping[1].name} are typing `;
    } else if (currentlyTyping.length > 2) {
      typingText = `Several people are typing `;
    } else {
      typingText = '';
    }
    console.log(typingText);

    const typingIndicator = (
      <div id='typing-indicator'>
        {typingText} {typingText ? typingAnimation : ''}
      </div>
    );

    return (
      <div className='container' style={{maxWidth: '800px', paddingTop: '100px'}}>
        <div className='chat-header'>
          <h5>Chat</h5>
        </div>
        <ChatBox 
          user={user}
          messages={messages}
          onSubmit={this.handleSendMessage}
          isLoading={isLoading}
          typingListener={this.typingListener}
          typingIndicator={typingIndicator}
        />
      </div>
    );
  }
}

export default Chat;
