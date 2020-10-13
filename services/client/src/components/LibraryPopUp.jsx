import React from 'react';

import axios from 'axios';

const LibraryPopUp = ({libraryID, closeInfo}) => {

    const [library, setLibrary] = React.useState([]);

    const getSpecificLibrary = (id) => {
        axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/library/${id}`)
        .then(function (response) {
          setLibrary(response.data.library);
        })
        .catch(function (error) {
          console.log(error);
        })
      }

    React.useEffect(() => {
        getSpecificLibrary(libraryID);
      },[]);

    return (
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                <p class="modal-card-title">{library.name}{library.version && " - Latest Version: " + library.version}</p>
                <button onClick={() => closeInfo()} class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">

                  <table className="table">
                    <thead>
                        <tr>
                            <th>Repository</th>
                            <th>Download Count</th>
                            <th>Issue Count</th>
                            <th>Author</th>
                            <th>User Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{library.repository}</th>
                        <th>{library.download_count}</th>
                        <th>{library.issue_count}</th>
                        <th>{library.author}</th>
                        <th>{library.user_rating}</th>
                        <th></th>
                      </tr>
                    </tbody>
                  </table>

                </section>
                <footer class="modal-card-foot">
                </footer>
            </div>
        </div>
    )
};

export default LibraryPopUp;