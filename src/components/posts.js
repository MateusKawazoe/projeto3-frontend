import React from 'react'
import '../styles/posts.css'
import video from 'cloudinary-video-player'

export default function Posts({ type, data }) {
    
    switch(type) {
        case 1:
            return (
                <div className="data-container">
                    <label>{data}</label>
                </div>
            )
        
        case 2:
            return (
                <div className="data-container">
                    <img src={data} className="post-data"/>
                </div>
            )

        case 3: 
            return (
                <div className="data-container">
                    <video controls style={{'width': '100%'}}>
                        <source src={data}/>
                    </video>
                </div>
            )
    }
}