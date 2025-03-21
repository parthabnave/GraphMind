class Chatbox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        inputValue: '',
        serverResponse: null,
        isVisible: localStorage.getItem('chatboxVisible') === null || localStorage.getItem('chatboxVisible') === 'true',
      };
    }
  
    handleInputChange = (event) => {
      this.setState({ inputValue: event.target.value });
    };
  
    handleSendMessage = async () => {
      const { inputValue } = this.state;
      if (inputValue.trim()) {
        try {
          // Send the data to the server
          const response = await axios.post('http://localhost:5000/getParsedUML', {
            prompt: inputValue,
          });
  
          // Update the state with the server response
          this.setState({ serverResponse: response.data, inputValue: '' });
          console.log('Server Response:', response.data);
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
      const { isVisible, serverResponse } = this.state;
  
      if (!isVisible) return null;
  
      return (
        <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', border: '1px solid #000000', borderRadius: '12px', padding: '16px' }}>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button onClick={this.handleSendMessage} style={{ marginLeft: '8px', padding: '16px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '8px', border: 'none' }}>Send</button>
  
          {serverResponse && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
              <h4>Server Response:</h4>
              <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    }
  }
  
  export default Chatbox;
  