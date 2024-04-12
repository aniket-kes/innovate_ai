import {React, useState} from 'react'
import './rules.css'


function Rules() {
  const [visibleContent, setVisibleContent] = useState("Eu")
  const handleButtonClick = (content) => {
    setVisibleContent(content);
  }
  return (
    <div className='gpt3__whatgpt3 section__margin' id='whpt3'>
      <div className="rules_container">
        <div className='rules_header'>
          <div className='rules_header-box'>
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
          </div>
          
        </div>
        <div className='rules-each'>
          <div className="content">
            {visibleContent === "Eu" && (
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
            )}
            {visibleContent === "IT Acts" && (
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
            )}
            {visibleContent === "GDPR" && (
              <p>
                <li className="text-start">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem aliquid illo repellendus quas consequatur nesciunt quis. Maxime officiis, unde magnam itaque aperiam, consequatur aliquid, eum tenetur ipsum optio voluptatum. Dolorem alias, soluta temporibus iusto vero quam dicta velit dolore officia quisquam ad voluptatem eos dolorum quis voluptat.
                </li>
                <li className="text-start">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus numquam, odit magnam sunt doloremque molestias vel voluptatibus illum. Quos obcaecati porro soluta atque?
                </li>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>  
  )
}

export default Rules