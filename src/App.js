import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

//This is for development testing purposes only.
//Please do not reuse any information after your development


const API_KEY = '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';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

function App() {

  const [userInput, setUserInput] = useState({
    system: '',
    user: '',
    assistant: '',
    prompt: '',
    model: 'gpt-3.5-turbo-16k',
  });

  console.log(userInput)
  const [assistantResponse, setAssistantResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserInput = (e) => {
    setUserInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendUserInput = async () => {
    setLoading(true);

    const data = {
      model: userInput.model,
      messages: [
        {
          role: 'system',
          content: userInput.system     },
        {
          role: 'user',
          content: userInput.user     },
        {
          role: 'assistant',
          content:
            userInput.assistant    },
        {
          role: 'user',
          content:
            userInput.prompt 
            },
      ],
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        data,
        { headers }
      );
      const { choices } = response.data;
      const assistantResponse = choices[0].message.content;
      setLoading(false);
      setAssistantResponse(assistantResponse);
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };

  const formatAssistantResponse = (response) => {
    const paragraphs = response.split('\n\n');

    const formattedResponse = paragraphs.map((paragraph, index) => (
      <p key={index} className="text-left mb-4">
        {paragraph}
      </p>
    ));

    return formattedResponse;
  };

  return (
    <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-4">Chat :</h1>
    {loading ? (
      <>
        <h1 className="spinner"></h1>
      </>
    ) : (
      <>
        <div className="bg-gray-100 p-4 mb-4">
          {formatAssistantResponse(assistantResponse)}
        </div>
      </>
    )}

    <section className='m-6'>
      
    <div className="mb-4 ">
      <label className="block mb-2">
        Model:
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full"
          name="model"
          value={userInput.model}
          onChange={handleUserInput}
        >
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
          <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
          <option value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</option>
          <option value="text-davinci-003">text-davinci-003</option>
        </select>
      </label>
    </div>
    <div className="mb-4">
      <label className="block mb-2">
        System Role:
        <textarea
           className="border border-gray-300 rounded px-4 py-2 w-full"
          type="text"
          rows={4}
          name="system"
          value={userInput.system}
          onChange={handleUserInput}
        />
      </label>
    </div>
    <div className="mb-4">
<label className="block mb-2">
  User Role:
  <textarea
     className="border border-gray-300 rounded px-4 py-2 w-full"
    rows={4}
    name="user"
    value={userInput.user}
    onChange={handleUserInput}
  />
</label>
</div>

    <div className="mb-4">
      <label className="block mb-2">
        Assistant Role:
        <textarea
      
     
        className="border border-gray-300 rounded px-4 py-2 w-full"
          type="text"
          rows={4}
          name="assistant"
          value={userInput.assistant}
          
          onChange={handleUserInput}
        />
      </label>
    </div>
    <div className="mb-4">
      <label className="block mb-2">
        Prompt:
        <textarea
          className="border border-gray-300 rounded px-4 py-2 w-full"
          type="text"
          rows={4}
        onChange={handleUserInput}
        />
      </label>
    </div>
   
    </section>
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      onClick={sendUserInput}
    >
      Send
    </button>
  </div>
  );
}

export default App;