import React, { useState } from "react";
import Editor from "./components/Editor";
import Output from "./components/Output";

const App = () => {
  const [renderedContent, setRenderedContent] = useState('');

  const handleRender = (content) => {
    setRenderedContent(content);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/2 text-white">
        <Editor onRender={handleRender} />
      </div>
      <div className="w-1/2 bg-gray-200">
        <Output content={renderedContent} />
      </div>
    </div>
  );
};

export default App;
