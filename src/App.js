import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chapters = [], setChapters] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("http://localhost:/chapter/available", {
      headers: { Authorization: '' }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          const { message, chapters = [] } = result
          if (message) console.log(message)
          console.log('chapters', chapters)
          setChapters(chapters);
        },
        (error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        }
      )
      .catch(e => {
        console.log(e)
      })
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (!chapters.length) {
    return (<h2>Looks like there are no chapters to view.</h2>)
  } else {
    return (
      <ul>
        {chapters.map(chapter => (
          <li key={chapter.id}>
            <h3>{chapter.name}</h3> 
            <p>{chapter.text}</p> 
          </li>
        ))}
      </ul>
    );
  }
}

export default App;
