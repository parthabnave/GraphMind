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
    // console.log("input", inputValue);

    if (inputValue.trim()) {
      try {
        console.log("before req");
        const response = await axios.post('http://localhost:5000/getParsedUML', {
          prompt: inputValue,
        });

        console.log('Server Response:', response.data);
        
        // Send data to parent using onResponse prop
        if (this.props.onResponse) {
          this.props.onResponse(response.data);
        }

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
      <div style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            value={inputValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyPress}
            placeholder="Type your message..."
            style={{
              width: '100%',
              padding: '24px 48px 24px 16px', // Doubled vertical padding
              borderRadius: '8px',
              border: '1px solid #ced4da',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              outline: 'none',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              ':focus': {
                borderColor: '#007bff',
                boxShadow: '0 0 0 2px rgba(0,123,255,0.25)',
              }
            }}
          />
          <button
            onClick={this.handleSendMessage}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              ':hover': {
                backgroundColor: '#0056b3',
                transform: 'translateY(-50%) scale(1.05)',
              },
              ':active': {
                transform: 'translateY(-50%) scale(0.95)',
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

export default Chatbox;