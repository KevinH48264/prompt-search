import { Box, Button } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { sendMessageInCurrentTab } from "./utils";
import { SwatchesPicker, CompactPicker } from "react-color";

interface PopupProps {}

const openFeedback = () => {
  chrome.tabs.create({url: "https://forms.gle/z9N2iVCcBRf6STWq7"});
}

const Popup: React.FC<PopupProps> = ({}) => {
  return <Box style={{display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", borderRadius: ".375rem"}} bg={"#343540"}>
      <h3 style={{ width: '500px', color: "white", display: 'flex', justifyContent: 'center', textAlign: 'center'}}>ChatGPT Prompts Search & Share</h3>
      <p style={{ margin: '10px', width: '90%', color: "white", display: 'inline', justifyContent: 'center', textAlign: 'center'}}>
      Get the best ChatGPT prompts with our new Chrome extension, ChatGPT Prompts Search and Share. The extension seamlessly integrates with the ChatGPT interface, providing you with recent and relevant prompts as you type. We store your recent prompts locally, ensuring that your data remains private unless you choose to share them. With the option to turn on the "Share Prompts and Answers" button, you can easily share your favorite prompts with others and learn from their experiences.
      </p>
      <p style={{ margin: '10px', width: '90%', color: "white", display: 'inline', justifyContent: 'center', textAlign: 'center'}}>
      We are currently in beta, so please feel free to share any feedback or requests you may have at <a style={{color: "lightblue"}} onClick={() => {openFeedback()}}href="https://forms.gle/z9N2iVCcBRf6STWq7">https://forms.gle/z9N2iVCcBRf6STWq7</a>.
      Your input will help us improve the extension and provide you with an even better experience. 
      </p>
      <p style={{ margin: '10px', width: '90%', color: "white", display: 'inline', justifyContent: 'center', textAlign: 'center'}}>
      Thanks for trying out our extension!
      </p>
    </Box>;
};

export default Popup;

ReactDOM.render(
  <React.StrictMode>
    <Popup></Popup>
  </React.StrictMode>,
  document.getElementById("root")
);