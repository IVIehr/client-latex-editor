/* eslint-disable react/prop-types */
import { parse, HtmlGenerator } from "latex.js";
import { useEffect, useState, useRef } from "react";
import stringDirection from "string-direction";
import { RiFilePaper2Fill } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import RenderIf from "../renderif";
import html2pdf from "html2pdf.js";
import { ESize } from "./enum";

const Output = ({ content, previewMode }) => {
  const [documentWidth, setDocumentWidth] = useState("75%");
  const [size, setSize] = useState("a4");
  let generator = new HtmlGenerator({ hyphenate: false });
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!previewMode) {
      setDocumentWidth("75%");
    }
  }, [previewMode]);

  const resize = (amount) => {
    setDocumentWidth(amount);
  };

  const exportPdf = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    const headingElements = iframeDocument.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    const htmltest = iframeDocument.querySelector(".test");

    const opt = {
      margin: [1.5, 2],
      filename: "latex_output.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "cm",
        orientation: "portrait",
        format: size,
      },
      pagebreak: { mode: "avoid-all" },
    };
  
    headingElements.forEach((heading) => {
      heading.style.fontWeight = "700"; // Set the desired font weight
    });
  
    // Temporarily remove padding from iframe's body
    const originalPadding = htmltest.style.padding;
    htmltest.style.padding = "0";
  
    const iframeHtml = iframeDocument.documentElement.innerHTML;
  
    const iframeContainer = document.createElement("div");
    iframeContainer.innerHTML = iframeHtml;
  
    // Restore original padding for iframe's body
    htmltest.style.padding = originalPadding;
  
    // Adjust content width to fit within the page boundaries
    const contentContainer = iframeContainer.querySelector(".test");
    contentContainer.style.width = "100%"; // Set the desired width
    
    html2pdf().set(opt).from(iframeContainer).save();
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

      var completeHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>latex output</title>
        </head>
        <body>
          <div class="test"
            style="direction:${HTMLDirection};
            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
            padding:1.5cm 2cm;
            background: white;
            margin: auto;
            width:${documentWidth};
            box-shadow: 0 0px 8px 0px #888888ab;
            font-size:10pt";
            >
            ${bodyHtml}
          </div>
        </body>
      </html>`;

      return completeHtml;

      // return `<div style="direction:${HTMLDirection}; font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif; padding:1.5cm 2cm; margin: auto; background: white; width:${documentWidth}; font-size:10pt">${bodyHtml}</div>`;
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
                          onClick={() => {
                            resize(ESize.letter);
                            setSize("letter");
                          }}
                        >
                          Letter
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
                          onClick={() => {
                            resize(ESize.tabloid);
                            setSize("tabloid");
                          }}
                        >
                          Tabloid
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
                          onClick={() => {
                            resize(ESize.A4);
                            setSize("a4");
                          }}
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
                          onClick={() => {
                            resize(ESize.A5);
                            setSize("a5");
                          }}
                        >
                          A5
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </RenderIf>
          <button
            className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2 focus:outline-none"
            onClick={() => exportPdf(size)}
          >
            <HiDownload />
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        className="output-frame w-full h-full border-0"
        title="Output"
        srcDoc={finalHTML()}
      ></iframe>
    </div>
  );
};

export default Output;
