import React, { useState } from "react";
import './App.css';
const surveyData = require('./survey-data.json');
function App() {
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);
 // const [fileInput, setFileInput] = useState(null);
  const [responses, setResponses] = useState({});

  // function handleInputChange(e) {
  //   try {
  //     const inputJson = JSON.parse(e.target.value);
  //     if (Array.isArray(inputJson) && inputJson.length > 0) {
  //       setSurvey(inputJson[0]);
  //       setError(null);
  //     } else {
  //       setError("Input must be an array of survey questions");
  //     }
  //   } catch (e) {
  //     setError("Invalid JSON format");
  //   }
  // }

  // function handleFileChange() {
  //   try {
  //     if (Array.isArray(surveyData) && surveyData.length > 0) {
  //       setSurvey(surveyData[0]);
  //       setError(null);
  //     } else {
  //       setError("Input must be an array of survey questions");
  //     }
  //   } catch (e) {
  //     setError("Invalid JSON format");
  //   }
  // }
  
  
  

  function renderQuestion(question) {
    if (question.condition) {
    const { question: q, answer: a } = question.condition;
    if (responses[q] !== a) {
      return null;
    }
  }
    switch (question.pollType) {
      case 0: // No response/statement only
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            <p>No response required.</p>
          </div>
        );
      case 1: // Free text
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            <input type="text" onChange={(e) => handleResponse(question, e.target.value)} />
          </div>
        );
      case 2: // Numeric
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            <input type="number" onChange={(e) => handleResponse(question, e.target.value)} />
          </div>
        );
      case 3: // Binary
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            <div>
              <label>
              <input type="radio" name={question.pollid} value="Yes" onChange={() => handleResponse(question, "Yes")} />
                Yes
              </label>
            </div>
            <div>
              <label>
              <input type="radio" name={question.pollid} value="No" onChange={() => handleResponse(question, "No")} />
                No
              </label>
            </div>
          </div>
        );
      case 4: // Multiple choice single choice
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            {question.pollOptions.map((option) => (
              <div key={option.optionId}>
                <label>
                <input type="radio" name={question.pollid} value={option} onChange={() => handleResponse(question, option)} />
                  {option.option}
                </label>
              </div>
            ))}
          </div>
        );
      case 5: // Multiple choice multi choice
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            {question.pollOptions.map((option) => (
              <div key={option.optionId}>
                <label>
                <input type="checkbox" name={question.pollid} value={option} onChange={() => handleResponse(question, option)} />
                  {option.option}
                </label>
              </div>
            ))}
          </div>
        );
      case 6: // Voice STT and TTS
        return (
          <div key={question.pollid}>
            <h3>{question.questionDisplay}</h3>
            <button>Record</button>
            <button>Stop</button>
            <button>Playback</button>
          </div>
        );
        case 7: // List
        return (
        <div key={question.pollid}>
        <h3>{question.questionDisplay}</h3>
        <select onChange={(e) => handleResponse(question, e.target.value)}>
        {question.countryList.map((option, index) => (
        <option key={index} value={option}>
        {option}
        </option>
        ))}
        </select>
        </div>
        );
      default:
        return null; // Unsupported question type
    }
  }
  function handleResponse(question, response) {
    setResponses((prevState) => ({
      ...prevState,
      [question.pollQuestion]: {
        pollid: question.pollid,
        response: response,
      },
    }));
  }
  
  // function handleDownload() {
  //   const surveyData = survey.pollItems.map((item) => {
  //     const response = responses[item.pollQuestion];
  //     let formattedResponse = '';
  //     if (response) {
  //       if (Array.isArray(response.response)) {
  //         formattedResponse = response.response.map((option) => option.optionLabel);
  //       } else {
  //         formattedResponse = response.response.optionLabel || response.response;
  //       }
  //     }
  //     return {
  //       question: item.pollQuestion,
  //       response: formattedResponse,
  //       pollid: item.pollid,
  //     };
  //   });
  //   const data = {
  //     survey: surveyData,
  //   };
  //   const fileName = "survey_responses.json";
  //   const contentType = "application/json;charset=utf-8;";
  //   const blob = new Blob([JSON.stringify(data)], { type: contentType });
  //   if (navigator.msSaveBlob) {
  //     navigator.msSaveBlob(blob, fileName);
  //   } else {
  //     const downloadLink = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = downloadLink;
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(downloadLink);
  //   }
  // }
  
  function handleSubmit(e) {
    e.preventDefault();
    let output = "";
    if (surveyData) {
      output += "Survey: " + surveyData.title + "\n\n";
      surveyData[0].pollItems.forEach((question) => {
        output += question.questionDisplay + "\n";
        const response = responses[question.pollQuestion];
        let formattedResponse = '';
        if (response) {
          if (Array.isArray(response.response)) {
            formattedResponse = response.response.map((option) => option.optionLabel);
          } else {
            formattedResponse = response.response.optionLabel || response.response;
          }
        }
        output += "Response: " + formattedResponse + "\n\n";
      });
    } else {
      output = "No survey data available";
    }
    alert(output);
  }
  
  
  

  
  

  return (
    <div>
      <h1>{survey ? survey.title : "Dynamic Survey"}</h1>
      {/* <p>{survey ? survey.referenceId : "Enter your survey JSON below or upload a file"}</p> */}
      {/* <textarea rows="10" onChange={handleInputChange} value={fileInput} />
      <input type="file" accept=".json" onChange={handleFileChange} /> */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {surveyData &&
        surveyData[0].pollItems.map((question) => renderQuestion(question))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
      }

export default App;
