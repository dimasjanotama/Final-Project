import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import PropTypes from 'prop-types'

class DeskripsiProduk extends React.Component {
    constructor(props) {
      super(props);
      this.state = { editorHtml: "" };
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(html) {
      this.setState({ editorHtml: html });
    }
  
    render() {
      return (
        <div className="text-editor">
          <p>{this.state.editorHtml}</p>
          <ReactQuill
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            modules={DeskripsiProduk.modules}
            formats={DeskripsiProduk.formats}
            theme={false} // pass false to use minimal theme
          />
        </div>
      );
    }
  }
  
  DeskripsiProduk.modules = {
    toolbar: {
      container: "#toolbar"
    },
    clipboard: {
      matchVisual: false,
    }
  };
  
  DeskripsiProduk.propTypes = {
    placeholder: PropTypes.string
  };
  
  
 export default DeskripsiProduk