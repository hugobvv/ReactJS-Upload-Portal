/**
 * Project Name: ES6 Upload Portal
 * File: App.jsx
 * Author: Hugo Bouvet
 * Year: 2024
 *
 Description: The main application component for the ES6 Upload Portal.
 *            Manages state, handles API calls, and provides authentication and file upload functionality.
 *
 * Methods:
 *    - useEffect: Fetches initial theme data and validates the link on component mount.
 *    - pinSubmit(e): Handles PIN authentication for users.
 *    - uploadFiles(e): Manages file uploads and handles form submissions.
 *    - changeFiles(acceptedFiles): Adds files to the upload list and validates file types and sizes.
 *    - removeFile(index): Removes a file from the upload list and adjusts the upload state.
*/

import { useState, useEffect } from 'react'
import axios from "axios";
import config from './config';
import {PinForm, UploadForm} from "./Form.jsx";
import {Layout, Header} from './Layout';
import {ErrorMessage, LoadingMessage} from './Message';

function App() {
  /* CONSTANT */
  const DEFAULT_THEME = '/img/logo.svg';

  /* HOOKS USESTATE */
  const [files, setFiles] = useState([]); //Uploaded files
  const [filesSize, setFilesSize] = useState(0); //Setting of filesSize
  const [authenticated, setAuthenticated] = useState(false); //Authentication with PIN code
  const [errorMessage, setErrorMessage] = useState(null); //Display error message
  const [validLink, setValidLink] = useState(false); //Setting the validity of the link
  const [maximumSize, setMaximumSize] = useState(0); //Settings of maximum upload size (MB)
  const [parent_id, setParent_id] = useState(""); //Settings of parent_id to save it for futures request
  const [parent_class, setParent_class] = useState(""); //Settings of parent_class to save it for futures request
  const [allowedTypes, setAllowedTypes] = useState(''); //Settings of allowed types
  const [forbiddenTypes, setForbiddenTypes] = useState(''); //Settings of forbidden types
  const [showUploadButton, setShowUploadButton] = useState(false); //Enable/Disable Upload Button
  const [projectName, setProjectName] = useState(''); //Display of project name
  const [uploadLoading, setUploadLoading] = useState(""); //Upload Loading animation
  const [logoUrl, setLogoUrl] = useState(""); //Logo theme
  const [additionalMtd, setAdditionalMtd] = useState([]); //Additional metadatas

  /* API CALLS */
  useEffect(() => {
    /* Initialisation calls : fetch theme -> check link */
    const pathname = window.location.pathname; //Get id and parentClass in url
    const params = atob(pathname.split('/').pop()); //decoding url param
    var parts = params.split('/');

    if (parts.length!=2) { //wrong link
      setErrorMessage("Link is invalid");
      setTheme(); //set default theme
      return;
    }

    const parent_id = parts[1];
    const parent_class = parts[0] == "F" ? "Folder" : "Job";
    setParent_id(parent_id);
    setParent_class(parent_class);

    const fetchStyleImages = async () => {
      // Get theme
      const formData = new FormData();
      formData.append('parent_id', parent_id);
      formData.append('parent_class', parent_class);
      axios.post(`${config.serverUrl}/api/theme/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },}).then((response)=> {
        if (response.status >= 200 && response.status < 300) 
        {
          const logo = response.data.logo;
          const background = response.data.background;
          setTheme(logo, background);
          checkValidLink();
        } 
        else
          setTheme(); //set default theme
      }).catch((error) => {
        console.log(error);
        setErrorMessage(error.response?.data?.message || 'An error occured: no response from server');
        setTheme();
      });
    };

    const checkValidLink = async () => {
      // Check Link validity
      const formData = new FormData();
      formData.append('parent_id', parent_id);
      formData.append('parent_class', parent_class);
      axios.post(`${config.serverUrl}/api/link/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },}).then((response)=> {
        if (response.status >= 200 && response.status < 300) 
        {
          // Positive response and get extra datas
          setValidLink(true);
          setErrorMessage(null);
          setMaximumSize(response.data.maxSize);
          setAllowedTypes(response.data.allowedTypes);
          setForbiddenTypes(response.data.forbiddenTypes);
          setProjectName(response.data.projectName);
          let mtd = [];
          if (response.data.additionalMtd)
            mtd = JSON.parse(response.data.additionalMtd);
          let filledMtd = mtd.filter(row => !row.includes('')); //remove ['',''] rows
          setAdditionalMtd(filledMtd);
        } 
        else 
        {
          setErrorMessage(response.data);
          setValidLink(false);
        }
      }).catch((error) => {
        console.log(error);
        setErrorMessage(error.response?.data?.message || 'An error occured');
        setValidLink(false);
      });
      setValidLink(true);
    };

    fetchStyleImages();
  }, []);

  const pinSubmit = (e) => {
    /* PIN authentication */
    e.preventDefault();
    const formData = new FormData();
    const pinValue = document.getElementById('pin').value;
    formData.append('pin', pinValue);
    formData.append('parent_id', parent_id);
    formData.append('parent_class', parent_class);

    axios.post(`${config.serverUrl}/api/pin/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },}).then((response)=> {
        if (response.status >= 200 && response.status < 300) //Positive response
        {
          setAuthenticated(true);
          setErrorMessage(null);
        } 
        else
          setErrorMessage(response.statusText);
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error.response?.data?.message || 'An error occured');
    });
  }

  const uploadFiles = (dynamicFieldsData) => {
    /* Upload button handler */
    setErrorMessage(null);
    setUploadLoading("Loading"); //Upload animation

    const formData = new FormData();

    for (let i = 0; i < files.length; i++)
      formData.append(`file_${i}`, files[i]);
    
    const nameValue = document.getElementById('name').value;
    const emailValue = document.getElementById('email').value;
    let fileNameArray = []; // file structure of each file (if user submitted folder)
    files.forEach(file => { fileNameArray.push(file.path); });

    // Set additional metadatas attached to document
    const mtdArray = [["UploadPortalDocument","Name",nameValue]];
    mtdArray.push(["UploadPortalDocument","Email",emailValue]);
    for (let i = 0; i < dynamicFieldsData.length; i++) {
      const field = dynamicFieldsData[i];
      mtdArray.push([
        additionalMtd[i][0],
        additionalMtd[i][1],
        field.value
      ]);
    }

    formData.append('name', nameValue);
    formData.append('email', emailValue);
    formData.append('additionalMtd', JSON.stringify(mtdArray));
    formData.append('parent_id', parent_id);
    formData.append('parent_class', parent_class);
    formData.append('fileName', JSON.stringify(fileNameArray));

    // Send request
    axios.post(`${config.serverUrl}/api/upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },}).then((response)=> {
        if (response.status >= 200 && response.status < 300) //Positive response
        {
          setUploadLoading(response.data.message);
          setFiles([]);
          setErrorMessage(null);
          setShowUploadButton(false);
        } 
        else 
        {
          setErrorMessage(response.data);
          setUploadLoading("");
        }
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error.response?.data?.message || 'An error occured');
      setUploadLoading("");
    });
  };

  /* UTILS FUNCTIONS */
  const setTheme = (logoUrl = DEFAULT_THEME, backgroundUrl = DEFAULT_THEME) => {
    // Set logo and background with the given urls, or set the default theme
    setLogoUrl(logoUrl);
    document.body.style.background = `
      linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
      url(${backgroundUrl}) center center
    `;
  };

  const changeFiles = (acceptedFiles) => {
    /* Handle file adding -> checking file type */
    const arrayAllowedTypes = allowedTypes.split(', ');
    const arrayForbiddenTypes = forbiddenTypes.split(', ');
    // the file type must not be in forbidden types, and must be in allowed type (or allowed type must include all)
    const filesWithAllowedExtensions = acceptedFiles.filter(file => {
      var fileType = file.type.split('/');
      if (fileType.length > 0) 
        fileType = fileType[fileType.length - 1];
      return !arrayForbiddenTypes.includes(`${fileType}`) && (arrayAllowedTypes.includes(`${fileType}`) || arrayAllowedTypes.includes("all"));
    });

    setUploadLoading(""); //Remove success message

    if (filesWithAllowedExtensions.length === 0) 
      setErrorMessage("File type not allowed");
    else 
    {
      // Checking size 
      let allowedFilesSize = 0;
      filesWithAllowedExtensions.forEach(file => {
        allowedFilesSize+=file.size;
      });
      const newFilesSize = filesSize + allowedFilesSize
      setFilesSize(newFilesSize);
      let maxSizeO = maximumSize*1024*1024;
      if (maximumSize!=0 && newFilesSize > maxSizeO) //0 = no limitation
      {
        setErrorMessage("The size of the cumulative file (including those uploaded) is more than "+ maximumSize +" MB");
        setShowUploadButton(false);
      }
      else
      {
        setErrorMessage(null);
        setShowUploadButton(true);
      }
      setFiles(prevFiles => [...prevFiles, ...filesWithAllowedExtensions]);
    }
  };

  const removeFile = (index) => {
    /* Remove file from list */
    setFiles(prevFiles => {
      // Checking new size to allow upload
      const fileToRemove = prevFiles[index];
      const newFilesSize = filesSize - fileToRemove.size;
      setFilesSize(newFilesSize);
  
      let maxSizeO = maximumSize * 1024 * 1024;
  
      if (maximumSize==0 || newFilesSize < maxSizeO) //0 = no limitation
      {
        setErrorMessage(null);
        setShowUploadButton(true);
      }
        
      if (newFilesSize==0)
        setShowUploadButton(false);

      return prevFiles.filter((_, i) => i !== index);
    });
  };

  /* Display depending on link validity and pin authentication */
  return (
    <Layout>
      <Header logoUrl={logoUrl} projectName={projectName}/>
      {validLink ? (
        authenticated ? (<>
            <UploadForm 
              fileNames = {files} 
              fileSize = {filesSize}
              onSubmit={uploadFiles} 
              onFileChange={changeFiles} 
              RemoveFile={removeFile} 
              maximumSize={maximumSize} 
              allowedTypes={allowedTypes}
              forbiddenTypes={forbiddenTypes}
              showUploadButton={showUploadButton}
              additionalMtd = {additionalMtd}
            />
            <LoadingMessage loading={uploadLoading}/>
            <ErrorMessage msg={errorMessage}/>
          </>)
          : 
          (<>
            <PinForm onSubmit={pinSubmit}/>
            <ErrorMessage msg={errorMessage}/>
          </>))
      : 
      <ErrorMessage msg={errorMessage}/>}
    </Layout>
  );
}

export default App
