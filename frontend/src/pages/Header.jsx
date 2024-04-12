import React from 'react'
import './header.css'
// import people from '../../assets/people.png'
import ai from '../assets/ai.png'
import { Context } from '../main'
import {useNavigate} from 'react-router-dom'

function Header() {
  const { isAuthenticated } = React.useContext(Context)
  const navigateTo = useNavigate();

  const islogin = localStorage.getItem('islogin')
  const handleOnclick = () => {
    if(isAuthenticated) {
      navigateTo("/chat")
      console.log('isAuthenticated', isAuthenticated);
    }
    else{
      window.location.href = '/login'  
    }
  }
  
  return (
    <div className='gpt3__header' id='home'>
      <div className='gpt3__header-content'>
        <h1 className='gradient__text'>Have a question? </h1>
        <p>Get instant answers on any topic, powered by people like you.</p>
        <div className='gpt3__header-content__input'>
          {/* <input type="email" placeholder='Your email address' /> */}
          <button className='gpt3__header-button' type='button' onClick={handleOnclick} >Get Started</button>
        </div>
        {/* <div className='gpt3__header-content__people'>
          <img src= { people } alt="people" />
          <p>1000 people Lorem ipsum dolor, sit amet . </p>
        </div> */}
      </div>
      <div className='gpt3__header-img'>
        <img src={ ai } alt="Ai" />
      </div>
      
    </div>
  )
}

export default Header
