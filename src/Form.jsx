/**
 * Project Name: ES6 Upload Portal
 * File: Form.jsx
 * Author: Hugo Bouvet
 * Year: 2024
 *
 * Description: This file contains two main components: UploadForm and PinForm.
 *              The UploadForm handles file uploads, displaying allowed and forbidden file types, 
 *              and the current upload progress. The PinForm handles PIN code submission for authentication.
 *
 * Components:
 *    - UploadForm: A form component for uploading files, displaying the upload progress, and allowed file types.
 *      - Props:
 *          - fileNames (array): The list of files to be uploaded.
 *          - fileSize (number): The total size of the files to be uploaded.
 *          - onSubmit (function): The function to call when the form is submitted.
 *          - onFileChange (function): The function to call when files are added or changed.
 *          - RemoveFile (function): The function to call when a file is removed from the list.
 *          - maximumSize (number): The maximum allowed size for the uploaded files.
 *          - allowedTypes (string): A comma-separated string of allowed file types.
 *          - forbiddenTypes (string): A comma-separated string of forbidden file types.
 *          - showUploadButton (boolean): A flag to indicate whether the upload button should be enabled.
 *          - additionalMtd (string array): An array containing the additional metadatas to display. Ex.: ([namespace1, mtd1],...)
 *    - PinForm: A form component for submitting a PIN code for authentication.
 *      - Props:
 *          - onSubmit (function): The function to call when the form is submitted.
 *    - displayMetadata(mtd): displays the metadata, for example "FileInformationMetadata" -> "File information metadata"
*/

import Dropzone from 'react-dropzone'
import { useState, useEffect } from 'react'

export function UploadForm ({fileNames, fileSize, onSubmit, onFileChange, RemoveFile, maximumSize, allowedTypes, forbiddenTypes, showUploadButton, additionalMtd})
{
  /* Moving placeholder */
  const [emailInputValue, setEmailInputValue] = useState('');
  const [nameInputValue, setNameInputValue] = useState('');
  
  /* Dynamic additional metadata fields */
  const [dynamicFields, setDynamicFields] = useState([]);
  let idCounter = 0;

  useEffect(() => {
    if (additionalMtd.length > 0 && dynamicFields.length === 0) {
      const initialFields = additionalMtd.map(item => ({
        id: idCounter++,
        label: displayMetadata(item[1]),
        value: '',
      }));
      setDynamicFields(initialFields);
    }
  }, [additionalMtd, dynamicFields.length]);
  

  /* Max upload size format display */
  let format = "MB"; 
  if(maximumSize > 1000)
  {
    maximumSize /= 1000;
    format = "GB";
  }
  fileSize = fileSize/1024/1024;

  /* Form submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(dynamicFields); //give dynamic fields to App.jsx
  };
   
  /* Form */
  return <form onSubmit={handleSubmit}>
    <div className="mt-5 position-relative">
      <label htmlFor="email" className={`custom-label ${emailInputValue ? 'visible' : ''}`}>
        E-mail address*
      </label>
      <input
        id="email"
        className="form-control custom-form-control"
        type="email"
        placeholder="E-mail address*"
        value={emailInputValue}
        onChange={(e) => setEmailInputValue(e.target.value)}
      />
    </div>

    <div className="mt-4-5 position-relative">
      <label htmlFor="name" className={`custom-label ${nameInputValue ? 'visible' : ''}`}>
        Name
      </label>
      <input
        id="name"
        className="form-control custom-form-control"
        type="text"
        placeholder="Name"
        value={nameInputValue}
        onChange={(e) => setNameInputValue(e.target.value)}
      />
    </div>

    {/* Dynamic fields based on additional metadatas */}
    {dynamicFields.map((field, index) => (
      <div key={field.id} className="mt-4-5 position-relative">
        <label htmlFor={`dynamic-field-${index}`} className={`custom-label ${field.value ? 'visible' : ''}`}>
          {field.label}
        </label>
        <input
          id={`dynamic-field-${index}`}
          className="form-control custom-form-control"
          type="text"
          placeholder={field.label}
          value={field.value}
          onChange={(e) => {
            const updatedFields = [...dynamicFields];
            updatedFields[index].value = e.target.value;
            setDynamicFields(updatedFields);
          }}
        />
      </div>
    ))}

    <Dropzone onDrop={onFileChange}>
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} /> 
              <div className= "mt-4 dropzone">
                <div className="form-text">
                  <p className="fs-6">Drag 'n' drop some files here, or click to select files</p>
                  {maximumSize != 0 && <p className="fs-6">Maximum upload size: {maximumSize} {format}</p>}
                  <progress value={fileSize} max={maximumSize}></progress>
                  {allowedTypes != "all" && <p className="fs-6">Allowed types: {allowedTypes}</p>}
                  {forbiddenTypes != "" && <p className="fs-6">Forbidden types: {forbiddenTypes}</p>}
                </div>
              </div>
          </div>
        </section>
      )}
    </Dropzone>
    
    <div className="mt-4">
      {fileNames.map((file, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <button type="button" className="btn btn-sm btn-outline-danger remove-form-button" onClick={() => RemoveFile(index)} style={{fontSize: '0.5rem'}}>X</button>
          <div>
            <p className="mb-0 mr-2">{file.name}</p>
            <p className="mb-0 mr-2 size-text">Size: {(file.size / (1024 * 1024)).toFixed(3)} MB</p>
          </div>
        </div>
      ))}
    </div>

    <button className="uploadButton" type="submit" disabled={!showUploadButton}>Upload</button>
  </form>
}

export function PinForm({onSubmit})
{
  /* Moving placeholder */
  const [pinInputValue, setPinInputValue] = useState('');

  /* Form */
  return <form onSubmit={onSubmit}>
    <div className="mt-5 position-relative">
      <label htmlFor="pin" className={`custom-label ${pinInputValue ? 'visible' : ''}`}>
        Enter PIN code
      </label>
      <input
        id="pin"
        className="form-control custom-form-control"
        type="number"
        placeholder="Enter PIN code"
        value={pinInputValue}
        onChange={(e) => setPinInputValue(e.target.value)}
      />
    </div>
    <button className="uploadButton" type="submit">Submit PIN</button>
  </form>
}

function displayMetadata(mtd) {
  /* return the metadata display string, for example "fileInformationMetadata" -> "File information metadata" */
  let result = mtd.replace(/([A-Z])/g, ' $1').trim();
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}