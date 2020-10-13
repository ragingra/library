import React from 'react';

import AddLibrary from './components/AddLibrary';
import LibraryList from './components/LibraryList';

import axios from 'axios';

const App = () => {

  const [libraries, setLibraries] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(0);

  const getAllLibraries = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/libraries`)
    .then(function (response) {
      setLibraries(response.data.libraries);
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  const deleteLibrary = (id) => {
    setLibraries(libraries.filter((library) => library.id !== id));
    axios.delete(
      `${process.env.REACT_APP_BACKEND_SERVICE_URL}/library/${id}`,
      {headers: {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json"
        }
    }
    )
    .then((response) => {
      console.log(response)
      },
      (error) => {
        console.log(error)
      }
    );
  }

  const handleClick = e => {
    const index = parseInt(e.target.id, 0);
    setActiveTab(index);
  };

  React.useEffect(() => {
    getAllLibraries();
  },[]);
 
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <br/>
            <h1 className="title is-1">Libraries</h1>
            <hr/><br/>

            <div className="tabs">
              <ul>
                <li onClick={handleClick} className={activeTab === 0 ? 'is-active' : ''}><a id={0}>All Libraries</a></li>
                <li onClick={handleClick} className={activeTab === 1 ? 'is-active' : ''}><a id={1}>Add Library</a></li>
              </ul>
            </div>

            {activeTab === 0 &&
              <h2>
                <LibraryList libraries={libraries} deleteLibrary={deleteLibrary} getAllLibraries={getAllLibraries}/>
              </h2>
            }

            {activeTab === 1 &&
              <h2>
                <AddLibrary getAllLibraries={getAllLibraries}/>
              </h2>
            }
            
          </div>
        </div>
      </div>
    </section>
  )

};

export default App;