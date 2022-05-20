import React from "react";
import './spinner.scss'

const Spinner = ({ text }) => {

    return (
        <>
            <div className="mySpinner">
                <div className="spinner-border text-primary text-center" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                {(text != "" && text != undefined) && <h2>{text}...</h2>}

            </div>
        </>
    );
}

export default Spinner;