import { useEffect } from "react";
import PropTypes from 'prop-types';
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Loader2, AlertTriangle } from "lucide-react";

const ReviewDisplay = ({ review, isLoading, error }) => {
    useEffect(() => {
        if (!review) return;
        const codeBlocks = document.querySelectorAll("pre code");
        for (const block of codeBlocks) {
            if (block.parentElement.querySelector(".copy-btn")) continue;

            const pre = block.parentElement;
            const button = document.createElement("button");
            button.textContent = "Copy";
            button.className =
                "copy-btn absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-sm text-white px-2 py-1 rounded transition";
            pre.style.position = "relative";
            pre.appendChild(button);

            button.onclick = () => {
                navigator.clipboard.writeText(block.innerText);
                button.textContent = "Copied!";
                button.classList.add("text-green-400");
                setTimeout(() => {
                    button.textContent = "Copy";
                    button.classList.remove("text-green-400");
                }, 1500);
            };
        }
    }, [review]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="animate-spin h-10 w-10 text-yellow-400" />
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
            <Markdown
                rehypePlugins={[rehypeHighlight]}
                className="prose prose-invert max-w-none text-gray-200 overflow-auto h-full p-1 leading-loose
                           prose-pre:border prose-pre:border-gray-700 prose-pre:text-white
                           prose-pre:rounded-xl prose-pre:px-4 prose-pre:py-3 prose-pre:overflow-x-auto
                           prose-code:bg-gray-700/50 prose-code:text-yellow-300 prose-code:rounded-md prose-code:px-1
                           prose-li:marker:text-orange-400 prose-strong:text-yellow-300"
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

ReviewDisplay.propTypes = {
    review: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string, 
};

export default ReviewDisplay;