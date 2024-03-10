import React, { useState } from "react";
import { FaArrowUp, FaArrowDown, FaPlus, FaTrash } from "react-icons/fa";

const QuestionForm = () => {


    // manage  questions and to track the data for a new question being added

    // questions => state holds array of question objects 
    const [questions, setQuestions] = useState([]);

    // newQuestion => state holds array of new question add objects , initialized  as empty
    const [newQuestion, setNewQuestion] = useState({
      name: "",
      type: "essay",
      choices: [],
      stage: "opened",
      attachFile: false,
      newChoice: "", // Track the new choice input
    });


  const [questionType, setQuestionType] = useState("");  //state to track the type of question 
  const [question, setQuestion] = useState("");          //state to track the text  question added
  const [choices, setChoices] = useState([]);            //state to track the choices for a multiple-choice question
  const [filterStage, setFilterStage] = useState("all"); // State for filter stage

    
  const handleAddQuestion = () => {
     // Adding the new question to the list of questions [...questions]
    setQuestions([...questions, newQuestion]);

    //clear all input fields in the question form
    setNewQuestion({
      name: "",
      type: "essay",
      choices: [],
      stage: "opened",
      attachFile: false,
      newChoice: "",
    });
  };

  const handleInputChange = (e, index, choiceIndex) => {
    const { name, value, type, checked } = e.target;
    const updatedQuestions = [...questions];

    if (name.startsWith("choices")) {
      if (type === "checkbox") {
        // Toggle the selected choice without removing others
        const selectedChoices = updatedQuestions[index].choices;
        const selectedChoiceIndex = selectedChoices.indexOf(value);
        if (selectedChoiceIndex === -1) {
          // If the choice is not already selected, add it
          updatedQuestions[index].choices.push(value);
        } else {
          // If the choice is already selected, remove it
          updatedQuestions[index].choices.splice(selectedChoiceIndex, 1);
        }
      } else {
        // For radio buttons, update the choices array with only the selected value
        updatedQuestions[index].choices = [value];
      }
    } else if (name === "newChoice") {
      setNewQuestion({ ...newQuestion, [name]: value });
    } else {
      // For other inputs, update the value directly
      updatedQuestions[index][name] = type === "checkbox" ? checked : value;
    }
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    setQuestion(""); // Clear previous question
    setChoices([]); // Clear previous choices
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };

  const renderInputBasedOnType = () => {
    switch (questionType) {
      case "essay":
        return (
          <textarea
            className="border border-gray-400 p-2 w-full"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Enter your essay question here..."
          />
        );
      case "single_choice":
      case "multi_choice":
        return (
          <>
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center">
                <input
                  type={questionType === "single_choice" ? "radio" : "checkbox"}
                  value={choice}
                  checked={
                    questionType === "single_choice"
                      ? question === choice
                      : choices.includes(choice)
                  }
                  onChange={handleQuestionChange}
                />
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...choices];
                    updatedChoices[index] = e.target.value;
                    setChoices(updatedChoices);
                  }}
                  className="border border-gray-400 p-2 w-full ml-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveChoice(index)}
                  className="p-2"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddChoice}
              className="mt-2 bg-green-500 text-white rounded-lg px-4 py-2"
            >
              Add Choice
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const updatedQuestions = [...questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index - 1];
      updatedQuestions[index - 1] = temp;
      setQuestions(updatedQuestions);
    }
  };

  const handleMoveDown = (index) => {
    if (index < questions.length - 1) {
      const updatedQuestions = [...questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index + 1];
      updatedQuestions[index + 1] = temp;
      setQuestions(updatedQuestions);
    }
  };


    // Function to handle filter stage change
    const handleFilterChange = (e) => {
        setFilterStage(e.target.value);
      };
    
      // Filtering questions based on the selected stage
      const filteredQuestions = filterStage === "all" ? questions : questions.filter((question) => question.stage === filterStage);
    


  return (
    <div className="w-full">
      <div className="flex justify-between p-2">
        <div className="text-3xl font-bold pb-3">Report Name : </div>
        <div className="text-3xl font-bold pb-3">  All Stages </div>
        <div className="text-3xl font-bold pb-3">Filter by stages:</div>
        <select
          value={filterStage}
          onChange={handleFilterChange}
          className="p-2 border border-gray-400 rounded-md"
        >
          <option value="all">All Stages</option>
          <option value="opened">Opened</option>
          <option value="action">Action</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">Question Name</th>
            <th className="border border-gray-200 p-2">Type</th>
            <th className="border border-gray-200 p-2">Choices</th>
            <th className="border border-gray-200 p-2">Stage</th>
            <th className="border border-gray-200 p-2">Attach File</th>
            <th className="border border-gray-200 p-2">Delete</th>
            <th className="border border-gray-200 p-2">Sort</th>
          </tr>
        </thead>

        <tbody>
        {filteredQuestions.map((question, index) => (
         
            <tr key={index}>
              {/* question name  */}
              <td className="border border-gray-200 p-2">
                <input
                  type="text"
                  name="name"
                  value={question.name}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full"
                />
              </td>

              {/* questionType (essay- single - multi) */}
              <td className="p-2">
                <select
                  id="questionType"
                  value={questionType}
                  onChange={handleQuestionTypeChange}
                  className="border border-gray-400 p-2 w-full"
                >
                  <option value="">Select...</option>
                  <option value="essay">Essay</option>
                  <option value="single_choice">Single Choice</option>
                  <option value="multi_choice">Multiple Choice</option>
                </select>
              </td>

              {/* Choices */}
              <td className="p-2">
                {questionType && <>{renderInputBasedOnType()}</>}
              </td>

              {/* Stage  */}
              <td className="border border-gray-200 p-2">
                <select
                  name="stage"
                  value={question.stage}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full"
                >
                  <option value="opened">Opened</option>
                  <option value="action">Action</option>
                  <option value="closed">Closed</option>
                </select>
              </td>

              {/* attach file  */}
              <td className="border border-gray-200 p-2">
                <input
                  type="checkbox"
                  name="attachFile"
                  checked={question.attachFile}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>

              {/* delete button  */}
              <td className="border border-gray-200 p-2">
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(index)}
                  className="mt-2 bg-red-600 text-white rounded-lg px-4 py-2"
                >
                  delete
                </button>
              </td>

              {/* up and down  */}
              <td className="border border-gray-200 p-2">
                {index > 0 && (
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      className="text-blue-500"
                    >
                      <FaArrowUp />
                    </button>
                  </div>
                )}
                {index < questions.length - 1 && (
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      className="text-blue-500 pt-2"
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        variant="danger"
        onClick={handleAddQuestion}
        className=" mt-2 bg-cyan-600 text-white rounded-lg px-4 py-2"
      >
        Add New Question
      </button>
    </div>
  );
};

export default QuestionForm;
