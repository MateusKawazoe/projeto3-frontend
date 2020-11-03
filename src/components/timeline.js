import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import '../styles/timeline.css'
import api from '../services/api'
import Swal from 'sweetalert2'
import Posts from './posts'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import VideocamIcon from '@material-ui/icons/Videocam'
import MessageIcon from '@material-ui/icons/Message'
import selected from '../assets/selected.png'

export default function Timeline({ setLoading }) {
    const [admin, setAdmin] = useState()
    const [feed, setFeed] = useState([])
    const [text, setText] = useState(false)
    const [photo, setPhoto] = useState(false)
    const [data, setData] = useState('')
    const [type, setType] = useState(0)
    const [video, setVideo] = useState(false)
    const [textArea, setArea] = useState(false)
    const [videoAux, setVideoAux] = useState('')
    const [photoAux, setPhotoAux] = useState('')
    const [aux, setAux] = useState('')

    const handleClose = (e) => {
        if(e)
            e.preventDefault()
        setText(false)
        setArea(false)
        setPhoto(false)
        setVideo(false)
    }

    const handlePhoto = (e) => {
        const file = e.target.files[0]

        if(file && file.size/1000000 > 50) {
            Swal.fire({
                icon: 'error',
                title: 'Imagem maior do que 50Mb!',
            })
            return
        }

        const reader = new FileReader()
        

        reader.onloadend = () => {
            setData(reader.result)  
        }

        reader.readAsDataURL(file)
    }

    const handleVideo = async (e) => {
        setAux(selected)
        const file = e.target.files[0]

        if(file && file.size/1000000 > 50) {
            Swal.fire({
                icon: 'error',
                title: 'Video maior do que 50Mb!',
            })
            return
        }
        setLoading(true)

        const reader = new FileReader()

        reader.onloadend = (e) => {
            setData(reader.result)
            console.log(e)
        }

        reader.readAsDataURL(file)

        await Swal.fire({
            showConfirmButton: false,
            timer: 3000,
            width: 0
        })
        setLoading(false)
    }

    async function handlePublicar(e) {
        e.preventDefault()

        if(data && type) {
            const aux = api.post('/public/store', {
                owner: {
                    photo: localStorage.getItem('photo'),
                    username: localStorage.getItem('username')
                },
                data: data,
                type: type
            })

            if(aux == 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Algo deu errado!',
                })
            } else {
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Publicação postada com sucesso!',
                    showConfirmButton: false,
                    timer: 2300
                })
                handleClose()
                newPost()
            }
        }
    }

    async function newPost() {
        const data = await api.post('/public/showMany')
        setFeed(data.data)
    }

    async function loadPosts() {
        const data = await api.post('/public/showMany')
        setFeed([...data.data])
    }

    useEffect(() => {
        loadPosts()
    }, [])

    async function checkAdmin() {
        const aux = await api.post('/user/showOne', {
            username: localStorage.getItem('username')
        })

        if(aux.data.admin) {
            setAdmin(1)
        }
    }

    useEffect(() => {
        checkAdmin()
    }, [])

    return (
        <div className="timeline-container">
            {text && (
                <div className="textModel">
                    <div  className="background-text" onClick={handleClose}
                    />
                    <form className="text-form">
                        {photo && (
                            <img className="text-content" src={data}/>
                        )}

                        {textArea && (
                            <textarea 
                                className="text-content"
                                placeholder="Digite seu texto aqui..."
                                onChange={(e) => {
                                    setData(e.target.value)
                                    setType(1)
                                }}
                            />
                        )}

                        {video && (
                            <img className="text-content" src={aux}/>
                        )}
                        <li className="buttons_container">
                            <button onClick={handlePublicar}>Publicar</button>
                    </li> 
                    </form>
                </div>
            )}
            
            {admin && (
                <div className="posts">
                    <ol className="buttons">
                        <li className="icon-container">
                            <MessageIcon 
                                className="icon" 
                                id="deletar" 
                                onClick={(e) => {
                                    if(type != 1) {
                                        setData('')
                                        setAux('')
                                    }
                                    setText(true)
                                    setArea(true)
                                }}
                            />
                            <p>Texto</p>
                        </li>
                        <li className="icon-container">
                            <input 
                                type="file" 
                                className="pick-midia"
                                accept="image/x-png,image/gif,image/jpeg"
                                onClick={() => {
                                    if(type != 2) {
                                        setData('')
                                        setAux('')
                                        setVideoAux('')
                                    }
                                    setPhotoAux('')
                                    setType(2)
                                    setText(true)
                                    setPhoto(true)
                                }}
                                onChange={handlePhoto}
                                value={photoAux}
                            />
                            <PhotoCameraIcon className="icon" id="cadastrar"/>
                            <p>Foto</p>
                        </li>
                        <li className="icon-container">
                            <input 
                                type="file" 
                                className="pick-midia"
                                accept="video/mp4,video/x-m4v,video/*"
                                onClick={() => {
                                    if(type != 3){
                                        setData('')
                                        setPhotoAux('')
                                    }
                                    setVideoAux('')
                                    setType(3)
                                    setText(true)
                                    setVideo(true)
                                }}
                                onChange={handleVideo}
                                value={videoAux}
                            />
                            <VideocamIcon className="icon" id="modificar"/>
                            <p id="modify">Video</p>
                        </li>
                    </ol>
                </div>
            )}
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