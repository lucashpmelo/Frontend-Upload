import React from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import "./styles.css";

// import { uniqueId } from 'lodash';
// import filesize from 'filesize';

// import api from '../../services/api';


class ImageCropper extends React.Component {

    constructor() {
        super();
        this.state = {
            imageDestination: ""
        };
        this.imageElement = React.createRef();
    }

    componentDidMount() {
        const cropper = new Cropper(this.imageElement.current, {
            zoomable: false,
            scalable: false,
            aspectRatio: 1,
            crop: () => {
                const canvas = cropper.getCroppedCanvas();
                this.setState({ imageDestination: canvas.toDataURL("image/png") });
            }
        });
    }

    // handleUpload = files => {
    //     const uploadedFiles = files.map(file => ({
    //       file,
    //       id: uniqueId(),
    //       name: file.name,
    //       readableSize: filesize(file.size),
    //       preview: URL.createObjectURL(file),
    //       progress: 0,
    //       uploaded: false,
    //       error: false,
    //       url: null,
    //     }));
    
    //     this.setState({
    //       uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    //     });
    
    //     uploadedFiles.forEach(this.processUpload);
    //   };

    //   processUpload = (uploadedFile) => {
    //     const data = new FormData();
    
    //     data.append('file', uploadedFile.file, uploadedFile.name);
    
    //     api.post('posts', data, {
    //       onUploadProgress: e => {
    //         const progress = parseInt(Math.round((e.loaded * 100) / e.total));
    
    //         this.updateFile(uploadedFile.id, {
    //           progress,
    //         })
    //       }
    //     }).then(response => {
    //       this.updateFile(uploadedFile.id, {
    //         uploaded: true,
    //         id: response.data._id,
    //         url: response.data.url
    //       });
    //     })
    //       .catch(() => {
    //         this.updateFile(uploadedFile.id, {
    //           error: true
    //         });
    //       });
    //   };

    render() {
        return (
            <div>
                <div className="img-container">
                    <img ref={this.imageElement} src={this.props.src} alt="Source" crossorigin />
                </div>
                <img className="img-preview" src={this.state.imageDestination} alt="Destination" />
                <div>
                    <button>
                        Salvar
                    </button>
                </div>
            </div>
        );
    }

}

export default ImageCropper;