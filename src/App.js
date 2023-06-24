import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    fetch('https://server-khaki-kappa.vercel.app/api/key')
      .then(response => response.json())
      .then(data => setApiKey(data.apiKey))
      .catch(error => console.error(error));
  }, []);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const personas = [
    'Lou Adler',
    'Stacy Donovan Zapa',
    'Johnny Campbell',
    'Greg Savage',
    'Maisha Cannon',
    'Glen Cathey'
  ];

  const styles = [
    'Captivating',
    'Enticing',
    'Witty',
    'Appealing',
    'Engaging',
    'Impactful',
    'Dynamic',
    'Exciting',
    'Professional'
  ];

  const [userInput, setUserInput] = useState({
    system: '',
    user: '',
    assistant: '',
    prompt: '',
    model: 'gpt-3.5-turbo-16k',
    persona: 'Lou Adler',
    style: 'Captivating'
  });
console.log('user input', userInput.prompt)
  const [assistantResponse, setAssistantResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
const defaultSystemContent = `you are an intelligent system to assist the user in rewriting a job description in human-like text.
System, Take on the persona of ${userInput.persona} to attract potential candidates.
System you must use a ${userInput.style.toLowerCase()} tonality and engage the reader.
System, you have to be ${userInput.style.toLowerCase()} the reader with what's in it for them using five or more points and these should engage the reader.
System, also refine the responsibilities and requirements and describe them using proper points with explanation. you can use upto 2000 words.
System, use your own creativity to yield even better results then following these instructions.
System, if a job description is not given, ask for it.`
    setUserInput(prevState => ({
      ...prevState,
      system: defaultSystemContent
    }));
  }, [userInput.persona, userInput.style]);

  useEffect(() => {
const defaultUserContent = ''
          setUserInput(prevState => ({
            ...prevState,
            prompt: defaultUserContent,
          }));
  }, [userInput.persona, userInput.style]);

  const handleUserInput = (e) => {
    setUserInput(prevState => ({
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
          content: userInput.system
        },
        {
          role: 'user',
          content: userInput.prompt,
        }
      ],
      temperature: 0.5,
      max_tokens: 2049,
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
      <h1 className="text-2xl font-bold mb-4">Chat:</h1>
      {loading ? (
        <>
          <h1 className="spinner"></h1>
          <p>Dear user, Please be patient RecruitGpt is refining your post to its best....</p>
        </>
      ) : (
        <>
          <div className="bg-gray-100 p-4 mb-4">
            {formatAssistantResponse(assistantResponse)}
          </div>
        </>
      )}

      <section className="m-6">
        <div className="mb-4">
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
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Persona:
            <select
              className="border border-gray-300 rounded px-4 py-2 w-full"
              name="persona"
              value={userInput.persona}
              onChange={handleUserInput}
            >
              {personas.map((persona, index) => (
                <option key={index} value={persona}>{persona}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Style:
            <select
              className="border border-gray-300 rounded px-4 py-2 w-full"
              name="style"
              value={userInput.style}
              onChange={handleUserInput}
            >
              {styles.map((style, index) => (
                <option key={index} value={style}>{style}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-4">
        <label className="block mb-2">
    System Instruction:
    <textarea
      className="border border-gray-300 rounded px-4 py-2"
      style={{ width: '50%', height: '200px' }}
      name="system"
      value={userInput.system}
      onChange={handleUserInput}
    />
  </label>
    </div>
    <div>

  <label className="block mb-2">
    Assistant Instruction:
    <textarea
      className="border border-gray-300 rounded px-4 py-2"
      style={{ width: '50%', height: '200px' }}
      name="system"
      value={userInput.assistant}
      onChange={handleUserInput}
      />
  </label>
      </div>
        <div className="mb-4">
          <label className="block mb-2">
            User Input:
            <textarea
              className="border border-gray-300 rounded px-4 py-2 w-full"
              style={{ width: '50%', height: '200px' }}
              name="prompt"
              value={userInput.prompt}
              onChange={handleUserInput}
            />
          </label>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={sendUserInput}
        >
          Send
        </button>
      </section>
    </div>
  );
}

export default App;
