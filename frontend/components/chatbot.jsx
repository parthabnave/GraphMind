import React from 'react';
import axios from 'axios';

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleSendMessage = async () => {
    const { inputValue } = this.state;
    console.log("input",inputValue);
    if (inputValue.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/getParsedUML', {
          prompt: inputValue,
        });

        console.log('Server Response:', response.data);
        // this.props.onResponse(response.data); // Send data to Dashboard
        this.setState({ inputValue: '' });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSendMessage();
    }
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '600px', backgroundColor: '#ffffff', border: '1px solid #000000', borderRadius: '12px', padding: '16px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyPress}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button onClick={()=>{this.handleSendMessage()}} style={{ marginLeft: '8px', padding: '16px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '8px', border: 'none' }}>Send</button>
      </div>
    );
  }
}

export default Chatbox;
