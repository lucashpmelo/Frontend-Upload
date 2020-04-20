import React, { Component } from 'react';
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';

import { uniqueId } from 'lodash';
//import filesize from 'filesize';

import api from '../../services/api';

class SetStateExample extends Component {
    state = {
        uploadedFiles: [],
        result: null,
        filename: null,
        filetype: null,
        src: null,
        error: null,
    };

    onChange = value => {
        this.setState(value);
    };

    handleUpload = files => {
        const uploadedFiles = {
            files,
            id: uniqueId(),
            name: files.name,
            //readableSize: filesize(files.size),
            //preview: URL.createObjectURL(files.src),
            progress: 0,
            uploaded: false,
            error: false,
            url: null,
        };

        this.setState({
            uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
        });

        //uploadedFiles.forEach(this.processUpload);
        this.processUpload(uploadedFiles);
    };

    updateFile = (id, data) => {
        this.setState({
            uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
                return id === uploadedFile.id
                    ? { ...uploadedFile, ...data }
                    : uploadedFile;
            })
        });
    };

    processUpload = (uploadedFile) => {
        const data = new FormData();

        var binaryData = [];
        binaryData.push(data);
        window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }))

        data.append('file', uploadedFile.files, uploadedFile.name);

        api.post('posts', data, {
            onUploadProgress: e => {
                const progress = parseInt(Math.round((e.loaded * 100) / e.total));

                this.updateFile(uploadedFile.id, {
                    progress,
                })
            }
        }).then(response => {
            this.updateFile(uploadedFile.id, {
                uploaded: true,
                id: response.data._id,
                url: response.data.url
            });
        })
            .catch(() => {
                this.updateFile(uploadedFile.id, {
                    error: true
                });
            });
    };

    componentWillUnmount() {
        this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }

    render() {
        return (
            <div>
                <DropNCrop onChange={this.onChange} value={this.state} />
                <button onClick={() => this.handleUpload(this.state)}>
                    Salvar
                </button>
            </div>
        );
    }
}

export default SetStateExample;