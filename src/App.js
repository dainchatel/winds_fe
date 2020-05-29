import React, { useState, useEffect } from 'react'
import './App.css'
import _ from 'lodash'

function App() {
  const [error] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [chapters = [], setChapters] = useState([])
  const [currentChapter = {}, setCurrentChapter] = useState({})

  useEffect(() => {
    fetch("http://localhost:6578/chapter/available")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          const { message, chapters = [] } = result
          if (message) console.log(message)
          setChapters(chapters)
        },
        (error) => {
          console.log(error)
          setIsLoaded(true)
          setChapters([])
        }
      )
      .catch(e => {
        console.log(e)
      })
  }, [])

  const createChapterView = chapter => {
    if (!chapter.text) return
    fetch(`${process.env.REACT_APP_BASE_URL}${chapter.id}/chapter_view`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(res => console.log(res))
  }
  

  const determineLastAvailableChapterMessage = () => {
    const sortedChapters = _.sortBy(chapters, chapter => _.toNumber(chapter.number))
    const lastHydratedChapter = _.findLast(sortedChapters, chapter => !!chapter.text)
    return `Right now, you can only read up to ${_.startCase(lastHydratedChapter.name)}.`
  }
  
  const determineFirstUnavailableChapterMessage = () => {
    const sortedChapters = _.sortBy(chapters, chapter => _.toNumber(chapter.number))
    const firstEmptyChapter = _.find(sortedChapters, chapter => !chapter.text)
    return `${_.startCase(firstEmptyChapter.name)} will automatically unlock when the site hits ${firstEmptyChapter.necessary_views} visitors.`
  }

  const header = () => {
    if (currentChapter.name) {
      return (
        <header>
          <h3 onClick={() => setCurrentChapter({})}>home</h3>
          <h3 className="no-tip">{currentChapter.name}</h3>
        </header>)
    } else {
      return (
        <header>
        <h1>the winds of jupiter</h1>
        <a id="twitter" target="_blank" rel="noopener noreferrer" href="http://twitter.com/dain_chat">@dain_chat</a>
        </header>
      )
    }
  }

  const main = () => {
    if (!isLoaded) {
      return <main><h1>Loading Chapters...</h1></main>
    } else if (error || !chapters.length) {
      return <main><h1>Looks like there was a problem loading the chapters.</h1></main>
    } else if (currentChapter.name) {
      return (
        <main>
          <p>{currentChapter.text ? currentChapter.text : `This chapter will unlock when the site hits ${currentChapter.necessary_views} visitors.`}</p>
        </main>)
    } else {
      return (
        <main>
          <p id="first-p">This is a finished book. I've uploaded it all to a database.</p>
          <p>{determineLastAvailableChapterMessage()} {determineFirstUnavailableChapterMessage()}</p>
          {chapters.map(chapter => (
            <h3 key={chapter.id} onClick={() => {
              setCurrentChapter(chapter)
              setTimeout(() => createChapterView(chapter), process.env.REACT_APP_VIEW_TIMEOUT || 600000)
            }}>{chapter.name}</h3>
          ))}
        </main>
      )
    }
  }

    return (
      <div>
        <section>
        {header()}
        {main()}
        </section>
        <footer>Copyright © 2020</footer>
      </div>
    )
}

export default App
