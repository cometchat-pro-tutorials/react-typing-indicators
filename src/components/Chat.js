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
        }
      })
    );
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
    const {messages, isLoading, user} = this.state;

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
        />
      </div>
    );
  }
}

export default Chat;
