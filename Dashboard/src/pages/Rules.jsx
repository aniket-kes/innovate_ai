import {React, useState} from 'react'
import pdfToText from 'react-pdftotext'
import './rules.css'


function Rules() {
  let [visibleContent, setVisibleContent] = useState("Eu")

  const handleButtonClick = (content) => {
    setVisibleContent(content);
  }

  let [rules, setRules] = useState([[]]);
  let [fileName, setfileName] = useState([])


  const onFileChange = async (event) => {
    event.preventDefault(); 
    let n = event.target.files.length
    let totalrules = []
    for(let i =0; i<n; i++){
        print("Iteration:",i)
        let pdftext = ""
        let file = event.target.files[i]
        fileName = [...fileName, file.name]
        await pdfToText(file)
            .then(text => {
                pdftext = text;
            })
            .catch(error => console.error("Failed to extract text from pdf"))
        
        var data = {"text":pdftext}
        const response = await fetch('http://127.0.0.1:5001/genrules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            }).then(response => response.json())
            .then(result => {
            //   console.log(result); 
                totalrules.push(result)
                setRules(result)
        })
    }
    //['file1','file2']
    //[['Rule1','Rule2','Rule3'],['Rule1','Rule2']]
    print(totalrules)
    setfileName(fileName)
    setRules(totalrules)
    // let pdftext = ""
    // const file = event.target.files[0]
    // console.log(file)
    // console.log(file2)
    // console.log(event.target.files.length)
    // setfileName(file.name)
    // await pdfToText(file)
    //     .then(text => {
    //         pdftext = text;
    //     })
    //     .catch(error => console.error("Failed to extract text from pdf"))
    

    // var data = {"text":pdftext}
    // const response = await fetch('http://127.0.0.1:5001/genrules', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   }).then(response => response.json())
    //   .then(result => {
    //     //   console.log(result); 
    //       setRules(result)
    //     })
    
  };


  return (
    <div className='gpt3__whatgpt3 section__margin' id='whpt3'>
    <div className='rules_header-box'>
        {/* <form encType="multipart/form-data"> */}
            <label htmlFor="inputfile">
                <h1>File Upload</h1>
            </label>
            <input type="file" name="pdf_file" id="inputfile" accept="application/pdf" onChange={onFileChange} multiple/>
            {/* <button type="submit">
                <p>Submit</p>
            </button> */}
        {/* </form> */}
    </div>
      <div className="rules_container">
        <div className='rules_header'>
        {fileName && fileName.map((file, index) => (
            (<div key={index} className='rules_header-box'>
            <button
              onClick={() => handleButtonClick(file)}
              className={visibleContent === file ? "active" : ""}
            >
              <p>{file}</p>
            </button>
          </div>)
      ))}
          {/* <div className='rules_header-box'>
            <button
              onClick={() => handleButtonClick("Eu")}
              className={visibleContent === "Eu" ? "active" : ""}
            >
              <p>EU Ai Regulation</p>
            </button>
          </div>
          <div className='rules_header-box'>
            <button
              onClick={() => handleButtonClick("IT Acts")}
              className={visibleContent === "IT Acts" ? "active" : ""}
            >
              <p>IT Acts</p>
            </button>
          </div>
          <div className='rules_header-box'>
            <button
              onClick={() => handleButtonClick("GDPR")}
              className={visibleContent === "GDPR" ? "active" : ""}
            >
              <p>GDPR</p>
            </button>
          </div> */}
          
        </div>
        <div className='rules-each'>
          <div className="content">
          {fileName && fileName.map((file, index) => (
            <div key={index}>
            {visibleContent === file && (
              <p className='customcolorp'>
              {rules[index].map((rule, idx) => (
          <li key={idx}>{`Rule ${idx + 1}: ${rule}`}</li>
        ))}
              </p>

            )}
            </div>
      ))}
          </div>
        </div>
      </div>
    </div> 
  )
}

export default Rules
