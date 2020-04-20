import React, { Component } from 'react';
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
// import { uniqueId } from 'lodash';
// import filesize from 'filesize';

import api from './services/api';

import GlobalStile from './styles/global';
import { Container, Content } from './styles';

import Upload from './components/Upload';
import FileList from './components/FileList';

//import SetStateExample from './components/StateExample'

class App extends Component {
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

  async componentDidMount() {
    // const response = await api.get("posts");

    // this.setState({
    //   uploadedFiles: response.data.map(file => ({
    //     id: file._id,
    //     name: file.name,
    //     readableSize: filesize(file.size),
    //     preview: file.url,
    //     uploaded: true,
    //     url: file.url
    //   }))
    // });
  }

  handleUpload = async file => {
    const data = {
    name: this.state.filename,
    result: this.state.result,
    filetype: this.state.filetype,
    src: this.state.src
    };
    
    await api.post('posts', data);
    
    // const uploadedFiles = {
    //   file,
    //   id: uniqueId(),
    //   name: file.name,
    //   //readableSize: filesize(file.size),
    //   //preview: URL.createObjectURL(file),
    //   progress: 0,
    //   uploaded: false,
    //   error: false,
    //   url: null,
    // };

    // this.setState({
    //   uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    // });

    //uploadedFiles.forEach(this.processUpload);

    // console.log(file.result);

    //const data = new FormData();

    //data.append('file', file, uploadedFiles.name);    
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

  render() {
    const { uploadedFiles } = this.state;

    return (
      <Container>
        <Content>
          <DropNCrop onChange={this.onChange} value={this.state} />
          <button onClick={() => this.handleUpload(this.state)}>
            Salvar
          </button>
          <Upload onUpload={this.handleUpload} />
          {!!uploadedFiles.length && (<FileList files={uploadedFiles} onDelete={this.handleDelete} />
          )}
        </Content>
        <GlobalStile />
      </Container>
    );
  }
}

export default App;