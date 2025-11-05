import { useState, useRef, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { ClipboardCopy, Check } from "lucide-react";
import ReviewDisplay from "./components/ReviewDisplay";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/ai/get-review`;
const INITIAL_CODE = `function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
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
    editorRef.current?.querySelector("textarea")?.focus();
  }, []);

  async function reviewCode() {
    setReview("");
    setError(null);
    setIsLoading(true);
    
    if (!code.trim()) {
        setError("Please enter code before requesting a review.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.post(API_URL, { code });
      setReview(response.data.review);
    } catch (error) {
      let message;
      if (error.response) {
        message = error.response.data.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        message = `Network Error: Could not reach the API server at ${API_BASE_URL}.`;
      } else {
        message = error.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="h-screen w-full p-6 flex flex-col lg:flex-row gap-6 bg-neutral-950 text-white font-sans">
      <div className="flex-1 min-h-[40vh] lg:min-h-full bg-gray-900 p-5 rounded-3xl shadow-2xl shadow-gray-900/50 flex flex-col border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-4 text-yellow-400 border-b border-gray-700/50 pb-2">Code Editor</h2>
        <div ref={editorRef} className="relative flex-1 overflow-auto rounded-xl w-full">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={20}
            className="editor-textarea"
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 15,
              minHeight: "100%",
              backgroundColor: "#171717",
              lineHeight: 1.6,
              color: "#F9FAFB",
              caretColor: "#FBBF24",
            }}
          />
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 bg-gray-700/60 hover:bg-gray-600/80 text-white p-2 rounded-lg transition-all transform hover:scale-105"
            title="Copy Code"
          >
            {copied ? <Check size={20} className="text-orange-400" /> : <ClipboardCopy size={20} />}
          </button>
        </div>
        <button
          onClick={reviewCode}
          disabled={isLoading || !code.trim()}
          className="mt-6 flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-400 text-neutral-900 font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/50 transition duration-300 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              Reviewing...
            </>
          ) : (
            "Review Code"
          )}
        </button>
      </div>

      <div className="flex-1 min-h-[40vh] lg:min-h-full bg-gray-900 p-5 rounded-3xl shadow-2xl shadow-gray-900/50 flex flex-col border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-4 text-yellow-400 border-b border-gray-700/50 pb-2">AI Code Review</h2>
        <div className="flex-1 overflow-auto bg-gray-800 p-6 rounded-xl border border-gray-700/50">
          <ReviewDisplay review={review} isLoading={isLoading} error={error} /> 
        </div>
      </div>
    </main>
  );
}

export default App;