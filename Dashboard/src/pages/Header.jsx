import React from 'react'
import './header.css'
// import people from '../../assets/people.png'
import ai from '../assets/ai.png'
import {Context} from '../main'

function Header() {
  const {isAuthenticated}= React.useContext(Context)
  const handleOnclick = () => {
    window.location.href = '/Login'
  }
  return (
    <div className='gpt3__header gradient__bg' id='home'>
      <div className='gpt3__header-content'>
        <h1 className='gradient__text'>Admin Panel</h1>
        <p>All the operations can be performed from this admin panel</p>
        <div className='gpt3__header-content__input'>
          {/* <input type="email" placeholder='Your email address' /> */}
          
          {!isAuthenticated &&  <button className='gpt3__header-button' type='button' onClick={handleOnclick} >Get Started</button>}
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
