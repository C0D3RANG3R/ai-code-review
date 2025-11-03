import { useState, useRef, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { ClipboardCopy, Check, Loader2, AlertTriangle } from "lucide-react";

const API_URL = "/ai/get-review";
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
    if (editorRef.current) {
      editorRef.current.querySelector("textarea")?.focus();
    }
  }, [code]);

  async function reviewCode() {
    setReview("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        { code }
      );
      
      setReview(response.data.review);

    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error.response) {
          errorMessage = error.response.data.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
          errorMessage = "Network Error: Could not reach the API server. Check backend is running on port 8000.";
      } else {
          errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
        document.body.removeChild(textarea);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = (event) => {
  };

  const ReviewDisplay = () => {
      if (isLoading) {
          return (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Loader2 className="animate-spin h-10 w-10 text-emerald-400" />
                  <p className="mt-4 text-lg font-semibold">Generating Review...</p>
              </div>
          );
      }
      
      if (error) {
          return (
              <div className="flex flex-col items-center justify-center h-full p-6 bg-red-900/30 border border-red-600 rounded-xl">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                  <h3 className="mt-4 text-xl font-extrabold text-red-400">Review Failed</h3>
                  <p className="mt-2 text-center text-red-300 break-words text-sm">{error}</p>
              </div>
          );
      }

      if (review) {
          return (
              // Enhanced prose styles for better readability of the markdown output
              <Markdown
                  rehypePlugins={[rehypeHighlight]}
                  className="prose prose-invert prose-code:bg-gray-700/50 prose-code:text-yellow-300 prose-pre:bg-gray-700/70 prose-li:marker:text-emerald-400 prose-strong:text-emerald-300 max-w-none text-gray-200 overflow-auto h-full p-1 leading-loose"
              >
                  {review}
              </Markdown>
          );
      }

      return (
          <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-xl font-light">Paste your code and click "Review" to begin.</p>
          </div>
      );
  };


  return (
    <main className="h-screen w-full p-6 flex flex-col lg:flex-row gap-6 bg-gray-950 text-white font-sans">
      
      {/* Left Section (Code Input) */}
      <div className="flex-1 min-h-[40vh] lg:min-h-full bg-gray-900 p-5 rounded-3xl shadow-2xl shadow-gray-900/50 flex flex-col border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-4 text-emerald-400 border-b border-gray-700/50 pb-2">Code Editor</h2>
        <div
          ref={editorRef}
          // Removed border-gray-700 from editor container for cleaner look
          className="relative flex-1 overflow-auto rounded-xl w-full code-editor-container"
        >
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={20} // Increased padding
            className="editor-textarea" 
            onPaste={handlePaste}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 15,
              minHeight: "100%",
              backgroundColor: '#1F2937', // Slightly different background for depth
              lineHeight: 1.6,
              color: '#F9FAFB',
              caretColor: '#34D399', // Green cursor
            }}
          />

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 bg-gray-700/60 hover:bg-gray-600/80 text-white p-2 rounded-lg transition-all transform hover:scale-105"
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
          // Changed to a more vibrant primary button style
          className="mt-6 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-300 transform hover:-translate-y-0.5"
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
      <div className="flex-1 min-h-[40vh] lg:min-h-full bg-gray-900 p-5 rounded-3xl shadow-2xl shadow-gray-900/50 flex flex-col border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-4 text-emerald-400 border-b border-gray-700/50 pb-2">AI Code Review</h2>
        <div className="flex-1 overflow-auto bg-gray-800 p-6 rounded-xl border border-gray-700/50">
            <ReviewDisplay />
        </div>
      </div>
    </main>
  );
}

export default App;