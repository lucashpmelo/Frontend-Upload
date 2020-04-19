import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import api from './services/api';

import GlobalStile from './styles/global';
import { Container, Content } from './styles';

import Upload from './components/Upload';
import FileList from './components/FileList';

import ImageCropper from './components/Cropper/indexTst';

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

class App extends Component {
  state = {
    uploadedFiles: [],
    flag: false,
    urlTeste: '',
    imageDestination: ""
  };

  constructor() {
    super();
    this.imageElement = React.createRef();
  }

  async componentDidMount() {
    const response = await api.get("posts");

    this.setState({
      uploadedFiles: response.data.map(file => ({
        id: file._id,
        name: file.name,
        readableSize: filesize(file.size),
        preview: file.url,
        uploaded: true,
        url: file.url
      }))
    });
  }

  handleUpload = files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    });

    uploadedFiles.forEach(this.processUpload);
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

    data.append('file', uploadedFile.file, uploadedFile.name);

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

  handleDelete = async id => {
    await api.delete(`posts/${id}`);

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
    });
  };

  componentWillUnmount() {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }

  handleChange = url => {
    this.setState({
      flag: true,
      urlTeste: url
    });    

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

  render() {
    const { uploadedFiles } = this.state;

    return (
      <Container>
        <Content>
          {!this.state.flag && (<Upload onUpload={this.handleUpload} />)}
          {!this.state.flag && !!uploadedFiles.length && (<FileList files={uploadedFiles} onChange={this.handleChange} onDelete={this.handleDelete} />)}
          {this.state.flag && (<ImageCropper url='http://localhost:3000/files/71b414dca77ca1dc6a153fc20ea44649-pp.jpg' imageElement={this.imageElement} imageDestination={this.state.imageDestination} />)}
        </Content>
        <GlobalStile />
      </Container>
    );
  }
}

export default App;