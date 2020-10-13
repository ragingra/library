import React from 'react';

import axios from 'axios';

import { useForm } from "react-hook-form";

const EditPopUp = ({libraryID, closeEdit, getAllLibraries}) => {

    const [library, setLibrary] = React.useState([]);
    const { register, handleSubmit, errors} = useForm();

    const getSpecificLibrary = (id) => {
        axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/library/${id}`)
        .then(function (response) {
          setLibrary(response.data.library);
        })
        .catch(function (error) {
          console.log(error);
        })
      }

    const onSubmit = data => {
        axios.put(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/library/${libraryID}`, data)
          .then(function (response, e) {
            console.log(response);
            getAllLibraries();
            closeEdit();
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
                <p class="modal-card-title">Edit: {library.name}</p>
                <button onClick={() => closeEdit()} class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">

                <div className="columns">
        <div className="column">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input defaultValue={library.name} className="input" name="name" ref={register({ required: true, maxLength: 100 })} />
                        {errors.name && <div>Name is required, and must be less than 100 chars</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Repository</label>
                    <div className="control">
                        <div className="select">
                            <select defaultValue={library.repository} name="repository" ref={register}>
                                <option value="PyPI">PyPI</option>
                                <option value="NPM">NPM</option>
                                <option value="Maven">Maven</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Download Count</label>
                    <div className="control">
                        <input defaultValue={library.download_count} className="input" type="number" name="download_count" ref={register({ min: 0})} />
                        {errors.download_count && <div>Download count is required</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Issue Count</label>
                    <div className="control">
                        <input defaultValue={library.issue_count} className="input" type="number" name="issue_count" ref={register({ min: 0})} />
                        {errors.issue_count && <div>Issue count is required</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Author</label>
                    <div className="control">
                        <input defaultValue={library.author} className="input" name="author" ref={register} />
                        {errors.author && <div>Author is required</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">User Rating - 1 to 5</label>
                    <div className="control">
                        <input defaultValue={library.user_rating} className="input" type="number" name="user_rating" ref={register({ min: 1, max:5})} />
                        {errors.user_rating && <div>Must be between 1 and 5</div>}
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <input className="button" type="submit" />
                    </div>
                </div>
            </form>
        </div>
    </div>

                </section>
                <footer class="modal-card-foot">
                {/* <button onClick={() => saveEdit()} class="button is-success">Save changes</button> */}
                </footer>
            </div>
        </div>
    )
};

export default EditPopUp;