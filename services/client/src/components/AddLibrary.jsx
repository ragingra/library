import React from 'react';
import { useForm } from "react-hook-form";

import axios from 'axios';

const AddLibrary = ({getAllLibraries}) => {

    const { register, handleSubmit, errors, reset} = useForm();

    const onSubmit = data => (
        axios.post(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/library`, data)
          .then(function (response, e) {
            console.log(response);
            reset();
            getAllLibraries();
          })
          .catch(function (error) {
            console.log(error);
          })
    );

  return (
    <div className="columns">
        <div className="column is-half">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input className="input" name="name" ref={register({ required: true, maxLength: 100 })} />
                        {errors.name && <div>Name is required, and must be less than 100 chars</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Repository</label>
                    <div className="control">
                        <div className="select">
                            <select name="repository" ref={register}>
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
                        <input className="input" type="number" name="download_count" ref={register({ min: 0})} />
                        {errors.download_count && <div>Download count is required</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Issue Count</label>
                    <div className="control">
                        <input className="input" type="number" name="issue_count" ref={register({ min: 0})} />
                        {errors.issue_count && <div>Issue count is required</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">Author</label>
                    <div className="control">
                        <input className="input" name="author" ref={register} />
                        {errors.author && <div>Author is required</div>}
                    </div>
                </div>

                <div className="field">
                    <label className="label">User Rating - 1 to 5</label>
                    <div className="control">
                        <input className="input" type="number" name="user_rating" ref={register({ min: 1, max:5})} />
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
  )
};

export default AddLibrary;