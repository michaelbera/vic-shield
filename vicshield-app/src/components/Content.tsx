import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

const Content = ({ value }: { value: string }) => {
  const markdown = value.replace(/\\n/g, "\n"); // convert '\n' thành xuống dòng thật

  return (
    <article className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({ ...props }) => (
            <ul
              className="list-disc list-inside space-y-2 bg-base-100 p-4 rounded-lg shadow"
              {...props}
            />
          ),

          li: ({ ...props }) => (
            <li className="leading-relaxed text-base-content" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-2xl text-warning font-semibold mt-4 mb-2"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className="leading-relaxed text-base-content mt-2 mb-4"
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
};

export default Content;
