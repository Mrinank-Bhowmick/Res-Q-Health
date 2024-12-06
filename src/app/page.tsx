'use client';

import { useChat } from 'ai/react';
import { Weather } from '@/components/weather';
import { Stock } from '@/components/stock';

export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>

          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === 'result') {
                if (toolName === 'displayWeather') {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                } else if (toolName === 'getStockPrice') {
                  const { result } = toolInvocation;
                  return <Stock key={toolCallId} {...result} />;
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <div>Loading weather...</div>
                    ) : toolName === 'getStockPrice' ? (
                      <div>Loading stock price...</div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
        className='text-black'
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}