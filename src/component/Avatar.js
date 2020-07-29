import React, { Component } from 'react';
import './Avatar.scss';
import Image from 'react-bootstrap/Image';

class Avatar extends Component {

    render() {

        const imgSrc = this.props.src;

        return(
            <div>
                <Image className="avatarContainer" alt="userImage" src={imgSrc} roundedCircle />
            </div>
        )
    }
}

export default Avatar;
