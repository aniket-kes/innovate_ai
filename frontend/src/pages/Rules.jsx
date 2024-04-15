import {React, useState, useEffect} from 'react'
import './rules.css'


function Rules() {
  const [fileName,setfileName] = useState([])
  const [rules,setRules] = useState([])
  // var fileName = []
  // var rules=[]
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        var data = {"text":""}
        const response = await fetch('http://127.0.0.1:5001/gettherules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            }).then(response => response.json())
            .then(result => {
            //  console.log(result);
            // fileName = result['filenames']
            setfileName(result['filenames'])
            setRules(result['totalrules'])
            // rules=result['totalrules']
            // console.log(fileName)
            // console.log(rules)
        })
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  // var fileName = ["ToTheWeb.pdf","ToTheWebCopy.pdf"]
  // var rules=[['Rule1','Rule2','Rule3'],['Rule1','Rule2']]
  const [visibleContent, setVisibleContent] = useState(fileName)
  const handleButtonClick = (content) => {
    setVisibleContent(content);
  }

  // setVisibleContent(["ToTheWeb.pdf","ToTheWebCopy.pdf"])
  //var visibleContent = ["ToTheWeb.pdf","ToTheWebCopy.pdf"]
  return (
    <div className='gpt3_whatgpt3 section_margin' id='whpt3'>
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
          </div> */}
          {/* <div className='rules_header-box'>
            <button
              onClick={() => handleButtonClick("IT Acts")}
              className={visibleContent === "IT Acts" ? "active" : ""}
            >
              <p>IT Acts</p>
            </button>
          </div> */}
          {/* <div className='rules_header-box'>
            <button
              onClick={() => handleButtonClick("GDPR")}
              className={visibleContent === "GDPR" ? "active" : ""}
            >
              <p>GDPR</p>
            </button>
          </div> */}
          
        </div>
        <div className='rules-each gpt3_whatgpt3'>
          <div className=" ">
          {/* {fileName.map((file,index)=>(
            <div key={index}>
              <p className='customcolorp'>
                {rules[index].map((rule,idx)=>(
                  <li key={idx}>{`Rule ${idx + 1}: ${rule}`}</li>
                ))}
              </p>
            </div>
          ))

          } */}
          {fileName && fileName.map((file, index) => (
            <div key={index}>
            {
              visibleContent === file && 
              (
              <p className='customcolorp'>
              {rules[index].map((rule, idx) => (
          <li key={idx}>{`Rule ${idx + 1}: ${rule}`}</li>
        ))}
              </p>

            )
            }
            </div>
      ))}
            {/* {visibleContent === "Eu" && (
              <p>
                Keeping in view the growing and changing needs of Industry
                and society, we at S.P.I.T. are committed to creating an
                environment which will raise the intellectual and moral
                standards of our students. Our endeavor is to strive for the
                overall development of students, thereby enabling them to
                accept challenges. In tune with this our vision is To build
                a renowned institute which will produce graduate engineers
                with global competency and social sensitivity.
              </p>
            )} */}
            {/* {visibleContent === "IT Acts" && (
              <p>
                <li className="text-start">
                  Provide high quality education in engineering and
                  technology promoting the Indian Values and Ethos that will
                  prepare the participants to lead lives of personal
                  integrity and civic responsibility in a global society.
                </li>
                <li className="text-start">
                  Promote an Educational Environment that combines academic
                  study with the excitement of intellectual curiosity for
                  engineers of tomorrow.
                </li>
              </p>
            )} */}
            {/* {visibleContent === "GDPR" && (
              <p>
                <li className="text-start">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem aliquid illo repellendus quas consequatur nesciunt quis. Maxime officiis, unde magnam itaque aperiam, consequatur aliquid, eum tenetur ipsum optio voluptatum. Dolorem alias, soluta temporibus iusto vero quam dicta velit dolore officia quisquam ad voluptatem eos dolorum quis voluptat.
                </li>
                <li className="text-start">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus numquam, odit magnam sunt doloremque molestias vel voluptatibus illum. Quos obcaecati porro soluta atque?
                </li>
              </p>
            )} */}
          </div>
        </div>
      </div>
    </div>  
  )
}

export default Rules