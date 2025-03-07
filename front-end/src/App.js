import { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket('ws://localhost:8765');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
    // Handle Blob by converting to text
    if (event.data instanceof Blob) {
      event.data.text().then((text) => {
        console.log('Received:', text, typeof text);
        setMessages((prev) => [...prev, text]);
      });
    } else {
      console.log('Received:', event.data, typeof event.data);
      setMessages((prev) => [...prev, event.data]);
    }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;