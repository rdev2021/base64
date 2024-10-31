'use client';

import { useState, SyntheticEvent, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Copy, CheckCircle, Terminal } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encoder' | 'decoder'>('encoder');
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [outputValue, setOutputValue] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Load saved state on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const savedInput = localStorage.getItem('inputValue');
    const savedOutput = localStorage.getItem('outputValue');
    const savedTheme = localStorage.getItem('isDarkMode');

    if (savedTab) setActiveTab(savedTab as 'encoder' | 'decoder');
    if (savedInput) setInputValue(savedInput);
    if (savedOutput) setOutputValue(savedOutput);
    if (savedTheme !== null) setIsDarkMode(savedTheme === 'true');
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
    localStorage.setItem('inputValue', inputValue);
    localStorage.setItem('outputValue', outputValue);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }, [activeTab, inputValue, outputValue, isDarkMode]);

  const handleTabChange = (tab: 'encoder' | 'decoder') => {
    setActiveTab(tab);
    setDecodeError('');

    // Keep the input value when switching tabs
    if (tab === 'encoder') {
      try {
        // When switching to encoder, try to decode the current input as it might be base64
        const decodedInput = atob(inputValue);
        setInputValue(decodedInput);
        setOutputValue(inputValue); // The original base64 becomes the output
      } catch {
        // If decoding fails, keep the current input
        const encodedOutput = btoa(inputValue);
        setOutputValue(encodedOutput);
      }
    } else {
      try {
        // When switching to decoder, try to encode the current input
        const encodedInput = btoa(inputValue);
        setInputValue(encodedInput);
        setOutputValue(inputValue); // The original text becomes the output
      } catch {
        // If encoding fails, keep the current input
        try {
          const decodedOutput = atob(inputValue);
          setOutputValue(decodedOutput);
        } catch {
          setDecodeError('Error decoding input. Please check the input format.');
        }
      }
    }
  };

  const handleInputChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    const newInput = e.currentTarget.value;
    setInputValue(newInput);

    if (activeTab === 'encoder') {
      try {
        setOutputValue(btoa(newInput));
        setDecodeError('');
      } catch (error) {
        setDecodeError('Error encoding input.' + error);
      }
    } else {
      try {
        setOutputValue(atob(newInput));
        setDecodeError('');
      } catch (error) {
        setDecodeError('Error decoding input. Please check the input format.' + error);
      }
    }
  };

  const handleCopy = async () => {
    if (!decodeError && outputValue) {
      try {
        await navigator.clipboard.writeText(outputValue);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <Header isDarkMode={isDarkMode} />
      <main className="flex-grow container mx-auto my-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              onClick={() => setIsDarkMode((prev) => !prev)}
            >
              {isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            </button>
          </div>
        </div>
        <div className="flex mb-4">
          <button
            className={`flex-1 px-4 py-2 rounded-l-md ${activeTab === 'encoder'
              ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} text-white hover:bg-gray-600`
              : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} text-gray-800 hover:bg-gray-500`
              }`}
            onClick={() => handleTabChange('encoder')}
          >
            Encoder
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-r-md ${activeTab === 'decoder'
              ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} text-white hover:bg-gray-600`
              : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} text-gray-800 hover:bg-gray-500`
              }`}
            onClick={() => handleTabChange('decoder')}
          >
            Decoder
          </button>
        </div>
        <div className={`bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-6`}>
          <div className="mb-4">
            <label htmlFor="input" className="block font-medium mb-2">
              Input:
            </label>
            <textarea
              id="input"
              className={`w-full h-32 rounded-md border border-gray-300 p-2 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={activeTab === 'encoder' ? 'Enter text to encode' : 'Enter base64 to decode'}
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="output" className="block font-medium">
                Output:
              </label>
              <button
                onClick={handleCopy}
                disabled={!outputValue || !!decodeError}
                className={`flex items-center gap-2 px-3 py-1 rounded-md ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                  } ${(!outputValue || !!decodeError) && 'opacity-50 cursor-not-allowed'}`}
              >
                {copySuccess ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              id="output"
              className={`w-full h-32 rounded-md border border-gray-300 p-2 ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'
                } resize-none ${decodeError ? 'border-red-500' : ''}`}
              value={decodeError ? decodeError : outputValue}
              readOnly
            />
          </div>
        </div>

        {/* Use Cases Section */}
        <div className={`mt-8 bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-6`}>
          <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Kubernetes Secrets</h3>
              <p className="mb-2">Base64 encoding is used in Kubernetes secrets to store sensitive data:</p>
              <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <code>
                  apiVersion: v1{'\n'}
                  kind: Secret{'\n'}
                  metadata:{'\n'}
                  {'  '}name: my-secret{'\n'}
                  type: Opaque{'\n'}
                  data:{'\n'}
                  {'  '}password: cGFzc3dvcmQxMjM= # base64 encoded
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Cloud-Init User Data</h3>
              <p className="mb-2">Base64 encoding is commonly used in cloud-init scripts:</p>
              <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <code>
                  #cloud-config{'\n'}
                  write_files:{'\n'}
                  - encoding: base64{'\n'}
                  {'  '}content: IyEvYmluL2Jhc2gK{'\n'}
                  {'  '}path: /script.sh
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Data URIs</h3>
              <p className="mb-2">Base64 is used in data URIs to embed images and other files directly in HTML/CSS:</p>
              <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <code>
                  &lt;img src=&quot;data:image/png;base64,iVBORw0K...&quot; /&gt;
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Email Attachments</h3>
              <p className="mb-2">MIME uses Base64 to encode email attachments and non-text content:</p>
              <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <code>
                  Content-Type: image/jpeg{'\n'}
                  Content-Transfer-Encoding: base64{'\n'}
                  /9j/4AAQSkZJRg...
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Warning</h3>
              <p className="mb-2">While its in somecase it used to encode sensitive information it is not a secure method of encryption.</p>
            </div>
          </div>
        </div>

        {/* Command Line Usage Section */}
        <div className={`mt-8 bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Command Line Usage</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Linux/macOS</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-2">Encode a string:</p>
                  <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <code>echo -n &quot;Hello World&quot; | base64</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-2">Decode a string:</p>
                  <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <code>echo &quot;SGVsbG8gV29ybGQ=&quot; | base64 -d</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-2">Encode a file:</p>
                  <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <code>base64 file.txt encoded.txt</code>
                  </pre>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Windows PowerShell</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-2">Encode a string:</p>
                  <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <code>[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(&quot;Hello World&quot;))</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-2">Decode a string:</p>
                  <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <code>[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(&quot;SGVsbG8gV29ybGQ=&quot;))</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-2">Encode a file:</p>
                  <pre className={`p-3 rounded-md overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <code>[Convert]::ToBase64String([IO.File]::ReadAllBytes(&quot;file.txt&quot;))</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}