import { useState, useRef, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css"; // Causing resolution error
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Causing resolution error
import axios from "axios";
import { ClipboardCopy, Check, Loader2, AlertTriangle } from "lucide-react";

// Note: Assuming the backend (on render) now has the corrected CORS policy applied.
const API_URL = "http://localhost:8000/ai/get-review";
const INITIAL_CODE = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}
`;

function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    // Focus logic remains for convenience
    if (editorRef.current) {
      editorRef.current.querySelector("textarea")?.focus();
    }
  }, [code]);

  async function reviewCode() {
    // Reset previous states
    setReview("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        { code }
      );
      
      // ✅ FIX: Correctly access the response data using the 'data' key from the controller
      setReview(response.data.review);

    } catch (error) {
      console.error("Error fetching review:", error);
      
      let errorMessage = "An unknown error occurred.";
      if (error.response) {
          // Server responded with a status code outside the 2xx range (e.g., 400, 500)
          errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
          // The request was made but no response was received (e.g., network error, CORS not fully resolved)
          errorMessage = "Network Error: Could not reach the API server.";
      } else {
          // Something else happened while setting up the request
          errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    // Use the older execCommand fallback just in case, though navigator.clipboard is standard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
    } else {
        // Fallback for environments where clipboard API is restricted (e.g., older browsers/iframes)
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text (execCommand fallback):', err);
        }
        document.body.removeChild(textarea);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = (event) => {
    // Allows pasting directly into the editor without complex manual handling,
    // as react-simple-code-editor handles the input value correctly.
  };

  const ReviewDisplay = () => {
      if (isLoading) {
          return (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Loader2 className="animate-spin h-10 w-10 text-green-500" />
                  <p className="mt-4 text-lg">Reviewing code with Gemini...</p>
              </div>
          );
      }
      
      if (error) {
          return (
              <div className="flex flex-col items-center justify-center h-full p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                  <h3 className="mt-3 text-xl font-bold text-red-400">Review Failed</h3>
                  <p className="mt-2 text-center text-red-300 break-words">{error}</p>
                  <p className="mt-4 text-sm text-red-400">
                    If the error persists, please verify the backend API key and CORS configuration.
                  </p>
              </div>
          );
      }

      if (review) {
          return (
              <Markdown
                  rehypePlugins={[rehypeHighlight]}
                  className="prose prose-invert max-w-none text-white overflow-auto h-full p-1 leading-8"
              >
                  {review}
              </Markdown>
          );
      }

      return (
          <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-xl">Click "Review Code" to get started.</p>
          </div>
      );
  };


  return (
    <main className="h-screen w-full p-4 flex flex-col lg:flex-row gap-4 bg-gray-900 text-white font-sans">
      
      {/* Left Section (Code Input) */}
      <div className="flex-1 min-h-[40vh] lg:min-h-full bg-gray-800 p-4 rounded-xl shadow-2xl flex flex-col">
        <h2 className="text-2xl font-bold mb-3 text-green-400">Code Editor</h2>
        <div
          ref={editorRef}
          className="relative flex-1 overflow-auto border border-gray-700 rounded-lg w-full code-editor-container"
        >
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={15}
            // Use the CSS class for styling the textarea/pre elements
            className="editor-textarea" 
            onPaste={handlePaste}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              minHeight: "100%",
              backgroundColor: '#1E293B', // Match surrounding dark background
              lineHeight: 1.5,
            }}
          />

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/70 text-white p-2 rounded-lg transition-all"
            title="Copy Code"
          >
            {copied ? (
              <Check size={20} className="text-lime-400" />
            ) : (
              <ClipboardCopy size={20} />
            )}
          </button>
        </div>

        {/* Review Button */}
        <button
          onClick={reviewCode}
          disabled={isLoading || !code.trim()}
          className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Reviewing...
            </>
          ) : (
            "Review Code"
          )}
        </button>
      </div>

      {/* Right Section (Review Output) */}
      <div className="flex-1 min-h-[40vh] lg:min-h-full bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col">
        <h2 className="text-2xl font-bold mb-3 text-green-400">AI Code Review</h2>
        <div className="flex-1 overflow-auto bg-gray-900 p-4 rounded-lg">
            <ReviewDisplay />
        </div>
      </div>
    </main>
  );
}

export default App;