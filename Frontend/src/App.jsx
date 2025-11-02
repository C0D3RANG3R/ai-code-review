import { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import prism from "prismjs";
import rehypeHighlight from "rehype-highlight";

// Styles
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import './App.css';

// Constants
const INITIAL_CODE = `function sum() {
  return 1 + 1
}`;

const API_URL = 'http://localhost:3000/ai/get-review';

const editorStyles = {
  fontFamily: '"Fira code", "Fira Mono", monospace',
  fontSize: 16,
  borderRadius: "5px",
  width: "100%"
};

function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const reviewCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(API_URL, { code });
      setReview(response.data.data);
    } catch (error) {
      setError('Failed to get code review. Please try again.');
      console.error('Review error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={handleCodeChange}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={10}
            style={editorStyles}
          />
        </div>
        <button
          onClick={reviewCode}
          className="review"
          disabled={isLoading}
        >
          {isLoading ? 'Reviewing...' : 'Review'}
        </button>
      </div>
      <div className="right">
        {error && <div className="error">{error}</div>}
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  );
}

export default App;
