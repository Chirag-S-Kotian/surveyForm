import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import useFormValidation from "./hooks/useFormValidation";

// Create a context for managing form data and functions
const SurveyContext = React.createContext();

const Form = () => {
  const initialState = {
    fullName: "",
    email: "",
    surveyTopic: "",
    favoriteLanguage: "",
    yearsExperience: "",
    exerciseFrequency: "",
    dietPreference: "",
    highestQualification: "",
    fieldOfStudy: "",
    feedback: "",
    additionalQuestions: [],
  };

  const validate = (data) => {
    let errors = {};
    if (!data.fullName) errors.fullName = "Full Name is required";
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.surveyTopic) errors.surveyTopic = "Survey Topic is required";
    if (data.surveyTopic === "Technology") {
      if (!data.favoriteLanguage)
        errors.favoriteLanguage = "Favorite Language is required";
      if (!data.yearsExperience || data.yearsExperience <= 0)
        errors.yearsExperience = "Years of Experience must be greater than 0";
    }
    if (data.surveyTopic === "Health") {
      if (!data.exerciseFrequency)
        errors.exerciseFrequency = "Exercise Frequency is required";
      if (!data.dietPreference)
        errors.dietPreference = "Diet Preference is required";
    }
    if (data.surveyTopic === "Education") {
      if (!data.highestQualification)
        errors.highestQualification = "Highest Qualification is required";
      if (!data.fieldOfStudy)
        errors.fieldOfStudy = "Field of Study is required";
    }
    if (!data.feedback || data.feedback.length < 50)
      errors.feedback = "Feedback must be at least 50 characters";
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting,setValues } =
    useFormValidation(initialState, validate);

  const [additionalQuestionsLoading, setAdditionalQuestionsLoading] =
    useState(false);

  useEffect(() => {
    const fetchAdditionalQuestions = async () => {
      if (values.surveyTopic) {
        setAdditionalQuestionsLoading(true);
        try {
          const response = await axios.get(
            `https://api.example.com/questions?topic=${values.surveyTopic}`
          );
          setValues((prevValues) => ({
            ...prevValues,
            additionalQuestions: response.data,
          }));
        } catch (error) {
          console.error("Error fetching additional questions:", error);
        } finally {
          setAdditionalQuestionsLoading(false);
        }
      }
    };

    fetchAdditionalQuestions();
  }, [values.surveyTopic]);

  return (
    <SurveyContext.Provider value={{ values, errors, handleChange }}>
      <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs italic">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Survey Topic
            </label>
            <select
              name="surveyTopic"
              value={values.surveyTopic}
              onChange={handleChange}
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Topic</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
            {errors.surveyTopic && (
              <p className="text-red-500 text-xs italic">
                {errors.surveyTopic}
              </p>
            )}
          </div>
          {/* Conditional fields based on survey topic */}
          {values.surveyTopic === "Technology" && (
            <>
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Favorite Programming Language
                </label>
                <select
                  name="favoriteLanguage"
                  value={values.favoriteLanguage}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${
                    errors.favoriteLanguage
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Select Language</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C#">C#</option>
                </select>
                {errors.favoriteLanguage && (
                  <p className="text-red-500 text-xs italic">
                    {errors.favoriteLanguage}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={values.yearsExperience}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${
                    errors.yearsExperience
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.yearsExperience && (
                  <p className="text-red-500 text-xs italic">
                    {errors.yearsExperience}
                  </p>
                )}
              </div>
            </>
          )}
          {values.surveyTopic === "Health" && (
            <>
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Exercise Frequency
                </label>
                <select
                  name="exerciseFrequency"
                  value={values.exerciseFrequency}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${
                    errors.exerciseFrequency
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Rarely">Rarely</option>
                </select>
                {errors.exerciseFrequency && (
                  <p className="text-red-500 text-xs italic">
                    {errors.exerciseFrequency}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Diet Preference
                </label>
                <select
                  name="dietPreference"
                  value={values.dietPreference}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${
                    errors.dietPreference ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Select Diet</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
                {errors.dietPreference && (
                  <p className="text-red-500 text-xs italic">
                    {errors.dietPreference}
                  </p>
                )}
              </div>
            </>
          )}
          {values.surveyTopic === "Education" && (
            <>
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Highest Qualification
                </label>
                <select
                  name="highestQualification"
                  value={values.highestQualification}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${
                    errors.highestQualification
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Select Qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
                {errors.highestQualification && (
                  <p className="text-red-500 text-xs italic">
                    {errors.highestQualification}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={values.fieldOfStudy}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${
                    errors.fieldOfStudy ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.fieldOfStudy && (
                  <p className="text-red-500 text-xs italic">
                    {errors.fieldOfStudy}
                  </p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Feedback
            </label>
            <textarea
              name="feedback"
              value={values.feedback}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errors.feedback ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500`}
            ></textarea>
            {errors.feedback && (
              <p className="text-red-500 text-xs italic">{errors.feedback}</p>
            )}
          </div>
          {additionalQuestionsLoading ? (
            <p className="text-white">Loading additional questions...</p>
          ) : (
            values.additionalQuestions.length > 0 && (
              <div className="border-t border-gray-300 pt-6 mt-6">
                <h2 className="text-white text-lg font-bold mb-2">
                  Additional Questions
                </h2>
                <ul className="space-y-2">
                  {values.additionalQuestions.map((question) => (
                    <li key={question.id} className="text-white">
                      {question.title}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Submit
          </button>
        </form>
      </div>
    </SurveyContext.Provider>
  );
};

export default Form;
