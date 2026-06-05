

import { useState } from 'react';
import { useChatSystem } from '../hooks/useChatSystem';

const ChatBox = ({ patientId }: any) => {

  const [text, setText] = useState('');

  const {
    canChat,
    messages,
    sendMessage,
  } = useChatSystem(patientId);

  return (
    <div>

      {!canChat ? (
        <h3>
          ❌ You must book an appointment first
        </h3>
      ) : (
        <>
          <div>
            {messages.map((m, i) => (
              <p key={i}>{m.message}</p>
            ))}
          </div>

          <input
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
          />

          <button
            onClick={() => {
              sendMessage(text);
              setText('');
            }}
          >
            Send
          </button>
        </>
      )}

    </div>
  );
};

export default ChatBox;

