'use client';

import { useState, SyntheticEvent, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Copy, CheckCircle, Terminal, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encoder' | 'decoder'>('encoder');
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [outputValue, setOutputValue] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [doubleEncodingWarning, setDoubleEncodingWarning] = useState('');

  // Is Base64 Regex Check
  const isBase64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

  // Define a more specific error type
  interface Base64Error extends Error {
    message: string;
  }

  // New function to generate user-friendly error messages
  const getDecodingErrorMessage = (error: Base64Error): string => {
    const errorString = error.message.toLowerCase();

    if (errorString.includes('invalid character')) {
      return 'The input contains characters that are not valid in Base64 encoding. Please ensure you have copied the correct Base64 string.';
    }

    if (errorString.includes('incorrect padding')) {
      return 'The Base64 string appears to be incomplete or incorrectly padded. Make sure the entire string is copied correctly.';
    }

    if (inputValue.trim() === '') {
      return 'Please enter a Base64 encoded string to decode.';
    }

    // Additional catch-all for invalid base64 format
    if (errorString.includes('invalid base64')) {
      return 'The input is not a valid Base64 encoded string.';
    }

    // Generic fallback error
    return 'Unable to decode the input. Please check the Base64 string and try again.';
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');

    setActiveTab('encoder');
    setInputValue('');
    setOutputValue('');
    setDecodeError('');
    setDoubleEncodingWarning('');
    if (savedTheme !== null) setIsDarkMode(savedTheme === 'true');
    localStorage.removeItem('inputValue');
    localStorage.removeItem('outputValue');
  }, []);

  const handleTabChange = (tab: 'encoder' | 'decoder') => {
    setActiveTab(tab);
    setInputValue('');
    setOutputValue('');
    setDecodeError('');
    setDoubleEncodingWarning('');
  };

  const handleInputChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    const newInput = e.currentTarget.value;
    setInputValue(newInput);
    setDoubleEncodingWarning('');
    setDecodeError('');

    if (activeTab === 'encoder') {
      // Check if input looks like it's already base64 encoded
      if (isBase64Regex.test(newInput.trim())) {
        setDoubleEncodingWarning('Warning: This input appears to already be Base64 encoded. Encoding it again will result in a different output.');
      }

      try {
        setOutputValue(btoa(newInput));
      } catch {
        setDecodeError('Error encoding input.');
      }
    } else {
      // Decoding tab
      if (!newInput.trim()) {
        setOutputValue('');
        return;
      }

      try {
        // Additional validation before decoding
        if (!isBase64Regex.test(newInput.trim())) {
          throw new Error('Invalid Base64 format');
        }

        setOutputValue(atob(newInput));
      } catch (error) {
        const friendlyErrorMessage = getDecodingErrorMessage(error as Base64Error);
        setDecodeError(friendlyErrorMessage);
        setOutputValue('');
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
      {/* To display warning note */}
      {doubleEncodingWarning && (
        <div className={`flex items-center p-3 rounded-md mb-4 ${isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100'}`}>
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          <p className="text-sm">{doubleEncodingWarning}</p>
        </div>
      )}
      <main className="flex-grow container mx-auto my-4 px-4 sm:my-8">
        {/* Theme Toggle - Made more compact for mobile */}
        <div className="flex justify-between items-center mb-4">
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            onClick={() => setIsDarkMode((prev) => !prev)}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Tabs - Made full width and more compact */}
        <div className="flex mb-4">
          <button
            className={`flex-1 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-l-md ${activeTab === 'encoder'
              ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} text-white hover:bg-gray-600`
              : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} text-gray-800 hover:bg-gray-500`
              }`}
            onClick={() => handleTabChange('encoder')}
          >
            Encoder
          </button>
          <button
            className={`flex-1 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-r-md ${activeTab === 'decoder'
              ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} text-white hover:bg-gray-600`
              : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} text-gray-800 hover:bg-gray-500`
              }`}
            onClick={() => handleTabChange('decoder')}
          >
            Decoder
          </button>
        </div>

        {/* Main Content Area - Adjusted for better mobile layout */}
        <div className={`bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-4 sm:p-6`}>
          <div className="mb-4">
            <label htmlFor="input" className="block font-medium mb-2">
              Input:
            </label>
            <textarea
              id="input"
              className={`w-full h-24 sm:h-32 rounded-md border border-gray-300 p-2 text-sm sm:text-base ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'
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
                className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base rounded-md ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
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
              className={`w-full h-24 sm:h-32 rounded-md border border-gray-300 p-2 text-sm sm:text-base ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'
                } resize-none ${decodeError ? 'border-red-500' : ''}`}
              value={decodeError ? decodeError : outputValue}
              readOnly
            />
          </div>
        </div>

        {/* Use Cases Section - Made responsive with stack layout on mobile */}
        <div className={`mt-6 sm:mt-8 bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-4 sm:p-6`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

        {/* Command Line Usage Section - Made responsive */}
        <div className={`mt-6 sm:mt-8 bg-${isDarkMode ? 'gray-700' : 'white'} shadow-md rounded-md p-4 sm:p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-xl sm:text-2xl font-bold">Command Line Usage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
