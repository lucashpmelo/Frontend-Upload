import React from "react";
//import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import "./styles.css";

const _Cropper = ({ url, imageElement, imageDestination }) => (
    <div>
        <div className="img-container">
            <img ref={imageElement} src={url} alt="Source" crossorigin />
        </div>
        <img className="img-preview" src={imageDestination} alt="Destination" />
    </div>
);

export default _Cropper;