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
    // const defaultSystemContent = `You are an AI language model trained to assist recruiters in refining job posts and your name is recruiterGPT. do not generate a response if the job description and some requirements are not given, and ask for them. It assists users in generating human-like text based on the given instructions and context. think properly and take your time before answering. Here are the instructions: Assistant, please generate a ${userInput.style.toLowerCase()} and vibrant job description for the position. The goal is to rewrite the existing job description, emphasizing the benefits and opportunities associated with the role. Take on the persona of ${userInput.persona}, a recruitment expert, and create the content in a ${userInput.style.toLowerCase()}  style that will attract potential candidates. Present the information in a compelling manner while keeping the user's requirements in mind. Even if certain points are not present in the job description, mention them and create enthusiasm around them. These Points include: 1- Offer a Competitive Compensation and Benefits.
    //       2- Vibrant and collaborative team,
    //       3- Professional Development Opportunities.
    //       4- Work-Life Balance.
    //       5- Offering Challenging and Meaningful Work.
    //       6- Become part of our family. 7- Career Development Plan. Prioritize communicating what's in it for them. Emphasize more on benefits for them and highlight the benefits and gains they can expect from the job.Also write about the essential requirements and qualifications needed in detail. First emphasize on tonality and benefits and then generate refined requirements. Remember, do not generate response if no actual job description is given to you, if it is not there, ask for it. Thank you!.`;
const defaultSystemContent = `you are an assistant to human. Generate human-like text. follow the instructions to generate refined job posts just like ${userInput.persona}. follow the persona of ${userInput.persona} in a ${userInput.style.toLowerCase()} tone. emphasize more on what benefits the candidate will get and make them vibrant and detailed. Rewrite requirements and what the candidate has to do in the job. rewrite the job description and create enthusiasm around it. length should be more than 800 words. remember always emphasize on what's in it for the candidates first in detail, remember assistant, in detail. Inform the candidates more about the benefits and engage them. Then give the requirements.`
    setUserInput(prevState => ({
      ...prevState,
      system: defaultSystemContent
    }));
  }, [userInput.persona, userInput.style]);

  useEffect(() => {
    // const defaultUserContent =  `Take the persona of ${userInput.persona} and use a ${userInput.style.toLowerCase()} tonality when rewriting the following Job Description. In the job description emphasize what’s in it for them.First include Career Development, training and growth opportunities, work-life balance, competitive salary, challenging and meaningful work and a vibrant and collaborative team. More of the content should be around these points infact 68% of you response should be around benefits and what an employee can get from us. emphasize less on the requirements, but explain them after describing benefits. Display response in a Job Description format and include a few of the main responsibilities. Generate content no more than 3500 words, But more than 1000 words. Note: If no information about the job is given in this prompt, ask for it. do not generate response if no job description and title is given to you.`;
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
