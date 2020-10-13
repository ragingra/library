import React from 'react';

import LibraryPopUp from './LibraryPopUp';
import EditPopUp from './EditPopUp';

const LibraryList = ({libraries, deleteLibrary, getAllLibraries}) => {

    const [seachTerm, setSearchTerm] = React.useState('');
    const [moreInfoID, setMoreInfoID] = React.useState(null);
    const [editID, setEditID] = React.useState(null);

    const closeInfo = () => {
        setMoreInfoID(null)
    }

    const closeEdit = () => {
        setEditID(null)
    }

    return (
        <div>

            <div className="columns">
                <div className="column is-half">
                    <input
                    className="input is-half"
                    type="text"
                    name="Filter"
                    placeholder="Filter"
                    onChange={event => setSearchTerm(event.target.value)}
                    />
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Repository</th>
                        <th>Download Count</th>
                        <th>Issue Count</th>
                        <th>Author</th>
                        <th>User Rating</th>
                        <th>More Info</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    libraries.filter(library => library.name.includes(seachTerm)).map(filteredLibrary => (
                            <tr key={filteredLibrary.id}>
                                <th>{filteredLibrary.name}</th>
                                <th>{filteredLibrary.repository}</th>
                                <th>{filteredLibrary.download_count}</th>
                                <th>{filteredLibrary.issue_count}</th>
                                <th>{filteredLibrary.author}</th>
                                <th>{[...Array(filteredLibrary.user_rating)].map((elementInArray, index) => ( 
                                    <i key={index} className="fa fa-star"></i>
                                        ) 
                                    )}
                                </th>
                                <th><a onClick={() => setMoreInfoID(filteredLibrary.id)}><i className="fa fa-info-circle"></i></a></th>
                                <th><a onClick={() => setEditID(filteredLibrary.id)}><i className="fa fa-edit"></i></a></th>
                                <th><a onClick={() => deleteLibrary(filteredLibrary.id)}><i className="fa fa-trash"/></a></th>
                            </tr>
                        )
                    )
                    }
                </tbody>
            </table>

            {moreInfoID && <LibraryPopUp libraryID={moreInfoID} closeInfo={closeInfo}/>}
            {editID && <EditPopUp libraryID={editID} closeEdit={closeEdit} getAllLibraries={getAllLibraries}/>}
        </div>
    )
};

export default LibraryList;