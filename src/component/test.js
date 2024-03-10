import React, { useState } from "react";
import { FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";

const QuestionForm = () => {
  // State to manage questions
  const [questions, setQuestions] = useState([]);

  // State to manage a new question being added
  const [newQuestion, setNewQuestion] = useState({
    name: "",
    type: "essay",
    choices: [],
    stage: "opened",
    attachFile: false,
    newChoice: "",
  });

  // State to manage filter stage
  const [filterStage, setFilterStage] = useState("all");

  // Function to handle input change for a question
  const handleInputChange = (e, index, choiceIndex) => {
    const { name, value, type, checked } = e.target;
    const updatedQuestions = [...questions];

    // If the input change is for choices
    if (name.startsWith("choices")) {
      if (type === "checkbox") {
        // Handle checkbox inputs for choices
        const selectedChoices = updatedQuestions[index].choices;
        const selectedChoiceIndex = selectedChoices.indexOf(value);
        if (selectedChoiceIndex === -1) {
          updatedQuestions[index].choices.push(value);
        } else {
          updatedQuestions[index].choices.splice(selectedChoiceIndex, 1);
        }
      } else {
        // Handle text inputs for choices
        updatedQuestions[index].choices = [value];
      }
    } else if (name === "newChoice") {
      // Update newChoice state for adding new choices
      setNewQuestion({ ...newQuestion, [name]: value });
    } else {
      // For other input changes
      updatedQuestions[index][name] = type === "checkbox" ? checked : value;
    }
    setQuestions(updatedQuestions);
  };
  // Function to add a new question
  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    // Reset newQuestion state after adding
    setNewQuestion({
      name: "",
      type: "essay",
      choices: [],
      stage: "opened",
      attachFile: false,
      newChoice: "",
    });
  };

  

  // Function to handle question type change
  const handleQuestionTypeChange = (e, index) => {
    const { value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = value;
    setQuestions(updatedQuestions);
  };

  // Function to delete a question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  

   // Function to add a new choice for a question
   const handleAddChoice = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.push("");
    setQuestions(updatedQuestions);
  };


  // Function to handle filter stage change
  const handleFilterChange = (e) => {
    setFilterStage(e.target.value);
  };

 

  // Function to remove a choice for a question
  const handleRemoveChoice = (index, choiceIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.splice(choiceIndex, 1);
    setQuestions(updatedQuestions);
  };

  // Function to render input fields based on question type
  const renderInputBasedOnType = (question, index) => {
    switch (question.type) {
      case "essay":
        return (
          <textarea
            className="border border-gray-400 p-2 w-full"
            value={question.choices[0]} // Fix value assignment here
            onChange={(e) => handleInputChange(e, index)}
            placeholder="Enter your essay question here..."
          />
        );
      case "single_choice":
      case "multi_choice":
        return (
          <>
            {question.choices.map((choice, choiceIndex) => (
              <div key={choiceIndex} className="flex items-center">
                {question.type === "single_choice" ? (
                  <input
                    type="radio"
                    value={choice}
                    checked={question.name === choice}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    value={choice}
                    checked={question.choices.includes(choice)}
                    onChange={(e) => handleInputChange(e, index, choiceIndex)}
                  />
                )}
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].choices[choiceIndex] = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  className="border border-gray-400 p-2 w-full ml-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveChoice(index, choiceIndex)}
                  className="p-2"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddChoice(index)}
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

// Function to move a question up
const handleMoveUp = (index) => {
  if (index > 0) {
    const updatedQuestions = [...questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[index - 1];
    updatedQuestions[index - 1] = temp;
    setQuestions(updatedQuestions);
  }
};
    // Function to move a question down
    const handleMoveDown = (index) => {
      if (index < questions.length - 1) {
        const updatedQuestions = [...questions];
        const temp = updatedQuestions[index];
        updatedQuestions[index] = updatedQuestions[index + 1];
        updatedQuestions[index + 1] = temp;
        setQuestions(updatedQuestions);
      }
    };


  // Filtering questions based on the selected stage
  const filteredQuestions =
    filterStage === "all"
      ? questions
      : questions.filter((question) => question.stage === filterStage);

  return (
    <div className="w-full">
      {/* Render filters */}
      <div className="flex justify-between p-2">
        <div className="text-3xl font-bold pb-3">Report Name : </div>
        <div className="text-3xl font-bold pb-3"> All Stages </div>
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
      {/* Render table headers */}
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
          {/* Render table rows */}
          {filteredQuestions.map((question, index) => (
            <tr key={index}>
              {/* Render question name input field */}
              <td className="border border-gray-200 p-2">
                <input
                  type="text"
                  name="name"
                  value={question.name}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full"
                />
              </td>
              {/* Render question type select field */}
              <td className="p-2">
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(e, index)}
                  className="border border-gray-400 p-2 w-full"
                >
                  <option value="essay">Essay</option>
                  <option value="single_choice">Single Choice</option>
                  <option value="multi_choice">Multiple Choice</option>
                </select>
              </td>
              {/* Render choices input field */}
              <td className="p-2">
                {question.type && (
                  <>{renderInputBasedOnType(question, index)}</>
                )}
              </td>
              {/* Render stage select field */}
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
              {/* Render attach file checkbox */}
              <td className="border border-gray-200 p-2">
                <input
                  type="checkbox"
                  name="attachFile"
                  checked={question.attachFile}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </td>
              {/* Render delete button */}
              <td className="border border-gray-200 p-2">
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(index)}
                  className="mt-2 bg-red-600 text-white rounded-lg px-4 py-2"
                >
                  delete
                </button>
              </td>
              {/* Render move up and move down buttons */}
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
      {/* Render add new question button */}
      <button
        type="button"
        onClick={handleAddQuestion}
        className=" mt-2 bg-cyan-600 text-white rounded-lg px-4 py-2"
      >
        Add New Question
      </button>
    </div>
  );
};

export default QuestionForm;
