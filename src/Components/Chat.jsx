import {useKindeAuth} from '@kinde-oss/kinde-auth-react';
import { useState, useEffect, useRef } from 'react'
import { BiPlus, BiComment, BiUser, BiFace, BiSend } from 'react-icons/bi'

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
function App() {
  const [text, setText] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const [isRateLimitError, setIsRateLimitError] = useState(false)
  const scrollToLastItem = useRef(null)
  const createNewChat = () => {
    setMessage(null)
    setText('')
    setCurrentTitle(null)
  }

  const backToHistoryPrompt = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setText('')
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!text) return

    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: text,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      setIsResponseLoading(true)

      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()

      if (data.error) {
        setIsRateLimitError(true)
      } else {
        setIsRateLimitError(false)
      }

      if (!data.error) {
        setMessage(data.choices[0].message)
        setTimeout(() => {
          scrollToLastItem.current?.lastElementChild?.scrollIntoView({
            behavior: 'smooth',
          })
        }, 1)
        setTimeout(() => {
          setText('')
        }, 2)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsResponseLoading(false)
    }
  }

  useEffect(() => {
    if (!currentTitle && text && message) {
      setCurrentTitle(text)
    }

    if (currentTitle && text && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: text,
        },
        {
          title: currentTitle,
          role: message.role,
          content:
            message.content.charAt(0).toUpperCase() + message.content.slice(1),
        },
      ])
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(
    (prevChat) => prevChat.title === currentTitle
  )
  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title).reverse())
  )

  const {logout} = useKindeAuth();

  return (
    <>
      <div className="container">
        <section className="sidebar">
          <div className="sidebar-header" onClick={createNewChat} role="button">
            <BiPlus size={20} color='#0FA47F'/>
            <button>New Chat</button>
          </div>
          <div className="sidebar-history">
            {uniqueTitles.length > 0 && <p>History</p>}
            <ul>
              {uniqueTitles?.map((uniqueTitle, idx) => (
                <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                  <BiComment size={20} color='#0FA47F' />
                  {uniqueTitle.slice(0, 18)}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-info">
            <div className="sidebar-info-upgrade">
              <img src='/email.png' color='#0FA47F' />
              <a href="mailto:sanjay.saud.vu@gmail.com?subject=CodePilot Report/Feedback
              ">Report/Feedback</a>
            </div>
            <div className="sidebar-info-user">
              <BiUser size={20} color='#0FA47F'/>
              <button onClick={logout} type="button">Log out</button>              
            </div>
          </div>
        </section>

        <section className="main">
          {!currentTitle && <h1>CodePilot</h1>}
          <div className="main-header">
            <ul>
              {currentChat?.map((chatMsg, idx) => (
                <li key={idx} ref={scrollToLastItem}>
                  <img
                    src={
                      chatMsg.role === 'user'
                        ? '/user.png'
                        : '/code.png'
                    }
                    alt={chatMsg.role === 'user' ? 'Face icon' : 'ChatGPT icon'}
                    style={{
                      backgroundColor: chatMsg.role === 'user' && '#ECECF1',
                    }}
                  />
                  <p>{chatMsg.content}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="main-bottom">
            {isRateLimitError && (
              <p>
                Please try again.
              </p>
            )}
            <form className="form-container" onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Send a message."
                spellCheck="false"
                value={
                  isResponseLoading
                    ? 'Loading...'
                    : text.charAt(0).toUpperCase() + text.slice(1)
                }
                onChange={(e) => setText(e.target.value)}
                readOnly={isResponseLoading}
              />
              {!isResponseLoading && (
                <button type="submit">
                  <BiSend size={20} color='#0FA47F' />
                </button>
              )}
            </form>
            <p>
            Copyright CodePilot 2023

            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
