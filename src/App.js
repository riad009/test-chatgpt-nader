import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'html-react-parser';
//  react html parser will convert html string reponse from gpt and convert it into JSX code and then we will render that to our component.

function App() {
  // const [apiKey, setApiKey] = useState('');

  // useEffect(() => {
  //   fetch('https://server-khaki-kappa.vercel.app/api/key')
  //     .then(response => response.json())
  //     .then(data => setApiKey(data.apiKey))
  //     .catch(error => console.error(error));
  // }, []);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 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',
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
      // remember you have to instruct gpt to generate desired styling and html response. try giving instructions in system or assistant roles.
      messages: [
        {
          role: 'system',
          content: 'Assist the user in rewriting a job description in human-like text.',
        },
        {
          role: 'user',
          content: `Present the content in a job description format.
          Use bolds, headings and exclamation marks when suitable and turn the job description into a marketing campaign.
          Take on the persona of ${userInput.persona} to attract potential candidates. 
          give the response in HTML with professional styling.`,
        },
        {
          role: 'assistant',
          content: `The goal is to rewrite a job description, putting emphasis on what's in it for them.
          Begin with a quick introduction and immediately follow by describing the benefits.
          Use a ${userInput.style.toLowerCase()} tonality when rewriting the job description. 
          Only generate content in black color, make content left aligned, do not generate any a tag and do not generate any links or any other color than black and no buttons.
          create bullets of headings. only use bold text for headings`,
        },
        {
          role: 'user',
          content: userInput.prompt,
        }
      ],
      temperature: 0.5,
      max_tokens: 3049,
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

  //  updated this functions. now we are using a function from reactHtmlParser package and givin it our content to convert it into jsx.
  const formatAssistantResponse = (response) => {
    const formattedResponse = ReactHtmlParser(response);
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
        {/*  we are rendering the parsed content in here. */}
            {formatAssistantResponse(assistantResponse)}
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
        {/* <label className="block mb-2">
    System Instruction:
    <textarea
      className="border border-gray-300 rounded px-4 py-2"
      style={{ width: '50%', height: '200px' }}
      name="system"
      value={userInput.system}
      onChange={handleUserInput}
    />
  </label> */}
    </div>
    <div>

  {/* <label className="block mb-2">
    Assistant Instruction:
    <textarea
      className="border border-gray-300 rounded px-4 py-2"
      style={{ width: '50%', height: '200px' }}
      name="system"
      value={userInput.assistant}
      onChange={handleUserInput}
      />
  </label> */}
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
