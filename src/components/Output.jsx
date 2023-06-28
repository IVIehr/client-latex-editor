/* eslint-disable react/prop-types */
import { parse, HtmlGenerator } from "latex.js";
import { useEffect, useState } from "react";
import stringDirection from "string-direction";
import { RiFilePaper2Fill } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import RenderIf from "../renderif";

const Output = ({ content, previewMode }) => {
  const [documentWidth, setDocumentWidth] = useState("75%");
  let generator = new HtmlGenerator({ hyphenate: false });


  useEffect(() => {
    if(!previewMode){
      setDocumentWidth("75%");
    }
  }, [previewMode])
  
  const resize = (amount) => {
    setDocumentWidth(amount);
  };

  const extractText = (str) => {
    var span = document.createElement("span");
    span.innerHTML = str;
    return span.textContent || span.innerText;
  };

  const finalHTML = () => {
    let direction = extractText(content);
    const HTMLDirection =
      stringDirection.getDirection(direction) === "ltr" ? "ltr" : "rtl";

    try {
      // Parse latex to HTML
      let outputToHTML = parse(content, {
        generator: generator,
      }).htmlDocument();

      // Convert HTML to string
      let parsedHTML = new XMLSerializer().serializeToString(outputToHTML);

      // Extract the content of <body> tag from string output
      var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(parsedHTML)[1];

      return `<div style="direction:${HTMLDirection}; font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif; padding:1.5cm 2cm; margin: auto; background: white; width:${documentWidth}; font-size:10pt">${bodyHtml}</div>`;
    } catch (error) {
      const errorBody = `<h4 style="color: red;">${error}</h4>`;
      if (error.location) {
        return `${errorBody} at line ${error.location.start.line}`;
      } else {
        return errorBody;
      }
    }
  };

  return (
    <div className="h-screen bg-violet-50">
      <div className="flex justify-end bg-violet-600 p-2">
        <div>
          <RenderIf isTrue={previewMode}>
            <Menu as="div" className="relative inline-block text-right">
              <div>
                <Menu.Button className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2 focus:outline-none">
                  <RiFilePaper2Fill />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => resize("15cm")}
                        >
                          A5
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => resize("20cm")}
                        >
                          A4
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => resize("25cm")}
                        >
                          Letter
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </RenderIf>
          <button className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2 focus:outline-none">
            <HiDownload />
          </button>
        </div>
      </div>
      <iframe
        className="output-frame w-full h-full border-0"
        title="Output"
        srcDoc={finalHTML()}
      ></iframe>
    </div>
  );
};

export default Output;
