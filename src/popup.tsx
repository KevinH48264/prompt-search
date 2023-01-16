import { Box, Button } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { sendMessageInCurrentTab } from "./utils";
import { SwatchesPicker, CompactPicker } from "react-color";

interface PopupProps {}

const changeBackground = (style : string) => {
  chrome.storage.local.set({color: ''})
  chrome.storage.local.set({key: style})
  sendMessageInCurrentTab(
    {
      action: "checkReload",
      command: "append",
    },
    function (response) {
    }
  );
  setTimeout(() => {}, 1000 * 20);
}

const openFeedback = () => {
  chrome.tabs.create({url: "https://tinyurl.com/stylegpt-feedback"});
}

const handleColorChange = (color : any, event : any) => {
  console.log('event' , event)
  chrome.storage.local.get(['key', 'color'], function(result) {
    if (result.color != color.hex && event._reactName == "onClick") {
      
      sendMessageInCurrentTab(
        {
          action: "checkReload",
          command: "append",
        },
        function (response) {
        }
      );
      setTimeout(() => {}, 1000 * 20);

      chrome.storage.local.set({key: ''})
      chrome.storage.local.set({color: color.hex})
    }
  })
}

const Popup: React.FC<PopupProps> = ({}) => {
  chrome.storage.local.get(['key'], function(result) {
    if (!result.key) {
      chrome.storage.local.set({key: ""})
    }
  })
  return <Box style={{display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", borderRadius: ".375rem"}} bg={"#343540"}>
      <h3 style={{ width: '100%', color: "white", display: 'flex', justifyContent: 'center', textAlign: 'center'}}>Welcome to Style ChatGPT</h3>
      <p style={{ margin: '10px', width: '90%', color: "white", display: 'inline', justifyContent: 'center', textAlign: 'center'}}>
        Customize your ChatGPT theme background by clicking on one of the buttons below. This is in beta so options are currently limited, but more will be coming if there is demand. So if you have any requests or feedback, please leave feedback at <a style={{color: "lightblue"}} onClick={() => {openFeedback()}}href="https://tinyurl.com/stylegpt-feedback">tinyurl.com/stylegpt-feedback</a>. Enjoy!
      </p>

      {/* insert line here */}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', overflow: "auto"}}>
         <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px'}}>
          <Button onClick={() => changeBackground('cute')} style={{ width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px'  }}>Cute</Button>
          <img style={{ width: "150px" }} src="https://drive.google.com/uc?export=view&id=1e-S6Ro4GgwWTlwOzFbPWpNaOKiHQtT6e" />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px'}}>
          <Button onClick={() => changeBackground('nature')} style={{ width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px'  }}>Nature</Button>
          <img style={{ width: "150px" }} src="https://drive.google.com/uc?export=view&id=1QPUgRukNszhrTd7BB0MZxkDI3cvM3r9W" />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px'}}>
          <Button onClick={() => changeBackground('cool')} style={{ width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px'  }}>Cool</Button>
          <img style={{ width: "150px" }} src="https://drive.google.com/uc?export=view&id=14n6-YtJ8-LO9EMRLhbAc9UbNBaqgpZJF" />
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', overflow: "auto"}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px'}}>
            <Button onClick={() => changeBackground('pretty')} style={{ width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px'  }}>Pretty</Button>
          <img style={{ width: "150px" }} src="https://drive.google.com/uc?export=view&id=1fly1ssPsJ9sL5yWA__tYRSCCWs4WWDZF" />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px'}}>
          <Button onClick={() => changeBackground('')} style={{ width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px'  }}>Default</Button>
          <img style={{ width: "150px", height: "150px", border: "1px solid black" }} src="https://drive.google.com/uc?export=view&id=1yaPXcYMvUqd8kEWheZr6qnNd_Avv2_PU" />
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', overflow: "auto"}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px'}}>
          <Button onClick={() => changeBackground('default')} style={{ width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px'  }}>Custom Color</Button>
          <SwatchesPicker onChange={(color, event) => handleColorChange(color, event)}/>
        </div>
      </div>
    </Box>;
};

export default Popup;

ReactDOM.render(
  <React.StrictMode>
    <Popup></Popup>
  </React.StrictMode>,
  document.getElementById("root")
);