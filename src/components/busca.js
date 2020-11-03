import React, { useState, useEffect } from 'react'
import '../styles/busca.css'
import api from '../services/api'
import $ from 'jquery'
import Swal from 'sweetalert2'
import Posts from './posts'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import VideocamIcon from '@material-ui/icons/Videocam'
import MessageIcon from '@material-ui/icons/Message'

export default function Busca() {
    const [data, setData] = useState('')
    const [feed, setFeed] = useState([])
    const [text, setText] = useState(false)
    const [photo, setPhoto] = useState(false)
    const [video, setVideo] = useState(false)
    const [type, setType] = useState([])

    async function handleText() {
        setText(!text)

        if(text) {
            $('#deletar').css('background-color', 'rgb(0, 116, 194)')

            if(type.indexOf(1) > -1) {
                type.splice(type.indexOf(1), 1)
            }
        } else {
            $('#deletar').css('background-color', 'rgb(0, 58, 97)')
            
            if(!type.includes(1)) {
                type.push(1)
            }
        }

        newPost()
    }

    async function handlePhoto() {
        setPhoto(!photo)

        if(photo) {
            $('#cadastrar').css('background-color', 'rgb(0, 116, 194)')

            if(type.indexOf(2) > -1) {
                type.splice(type.indexOf(2), 1)
            }
        } else {
            $('#cadastrar').css('background-color', 'rgb(0, 58, 97)')

            if(!type.includes(2)) {
                type.push(2)
            }
        }

        newPost()
    }

    async function handleVideo() {
        setVideo(!video)

        if(video) {
            $('#modificar').css('background-color', 'rgb(0, 116, 194)')

            if(type.indexOf(3) > -1) {
                type.splice(type.indexOf(3), 1)
            }
        } else {
            $('#modificar').css('background-color', 'rgb(0, 58, 97)')

            if(!type.includes(3)) {
                type.push(3)
            }
        }

        newPost()
    }

    async function newPost() {
        const data = await api.post('/public/searchPosts', {
            type: type
        })
        setFeed(data.data)
    }

    async function loadPosts() {
        const data = await api.post('/public/showMany')
        setFeed([...data.data])
    }

    useEffect(() => {
        loadPosts()
    }, [])

    return (
        <div className="timeline-container">
            <div className="posts">
                <ol className="buttons">
                    <li className="icon-container">
                        <MessageIcon 
                            className="icon" 
                            id="deletar" 
                            onClick={handleText}
                        />
                        <p>Texto</p>
                    </li>
                    <li className="icon-container">
                        <PhotoCameraIcon 
                            className="icon" 
                            id="cadastrar"
                            onClick={handlePhoto}
                        />
                        <p>Foto</p>
                    </li>
                    <li className="icon-container">
                        <VideocamIcon 
                            className="icon" 
                            id="modificar"
                            onClick={handleVideo}
                        />
                        <p id="modify">Video</p>
                    </li>
                </ol>
            </div>
            {feed.map(feed => {
                return (
                    <div className="publicacao" key={feed._id}>
                        <header className="owner-data">
                            <img src={feed.photo} className="owner-photo"/>
                            <label>{feed.owner}</label>
                            <div className="line"/>
                        </header>
                        <Posts type={feed.type} data={feed.data}/>
                    </div>
                )
            })}
        </div>
    )
}