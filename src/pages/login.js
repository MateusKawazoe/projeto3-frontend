import React, {
    useState,
    useEffect
} from "react"
import $ from 'jquery'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import api from '../services/api'
import Swal from 'sweetalert2'
import Loading from '../common/loading'

import "../styles/login.css"
import logo from '../assets/logo.png'

export default function Login({ history }) {
    const [user, setUser] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setpasswordConfirm] = useState("")
    const [visiblePassword, setVisible] = useState(false)
    const [cadastrar, setCadastrar] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState('')
    const [loading, setLoading] = useState(false)
    const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if(localStorage.getItem('token') !== '') {
        history.push('/main')
    }

    const handlePhoto = (e) => {
        const file = e.target.files[0]
        if(file.size/1000000 > 50) {
            Swal.fire({
                icon: 'error',
                title: 'Imagem maior do que 50Mb!',
            })
            return
        }
        if(file) {
            showPhoto(file)
            $('#profile').css('opacity', 1)

            if(file != '') {
                $('#profile').css('opacity', 0)
                $('.profilePicture').css('opacity', 1)
            } else {
                $('#profile').css('opacity', 1)
                $('.profilePicture').css('opacity', 0)
            }
        }
    }

    const showPhoto = async (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setProfilePhoto(reader.result)
        }
        return
    }

    function handleVisible() {
        if(visiblePassword) {
            setVisible(!visiblePassword)
            $('#password').css('-webkit-text-security', 'disc')
        } else {
            setVisible(!visiblePassword)
            $('#password').css('-webkit-text-security', 'none')
        }
    }

    async function handleSign(e) {
        e.preventDefault()
        var token

        if (user.length < 4 || password.length < 4) {
            Swal.fire({
                icon: 'error',
                title: 'Campos inválidos!',
                text: 'Preencha corretamente os campos!',
              })
            return
        }

        if(cadastrar) {
            if(password === passwordConfirm && emailValidator.test(email)) {
                setLoading(true)
                token = await api.post('/user/signup', {
                    foto: profilePhoto,
                    usuario: user,
                    email: email,
                    senha: password,
                    admin: 0
                })

                if(token.data === 1) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuário já cadastrado',
                    })
                    setLoading(false)
                    return
                } else if(token.data === 2) {
                    Swal.fire({
                        icon: 'error',
                        title: 'E-mail já cadastrado',
                    })
                    setLoading(false)
                    return
                }
                if(token.data.foto) {
                    localStorage.setItem('photo', token.data.foto.url)
                    localStorage.setItem('photo_id', token.data.foto._id)
                }
                if(token.data.admin > 0) {
                    localStorage.setItem('admin', 'ADMIN')
                }
                localStorage.setItem('token', token.data.token)
                localStorage.setItem('username', user)
                localStorage.setItem('email', email)
                localStorage.setItem('admin', '')
                localStorage.setItem('selected', 'perfil')
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Cadastro realizado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setLoading(false)
                history.push('/main')
            } else {
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'As senhas devem ser iguais!',
                  })
            }

            
        } else {
            setLoading(true)
            token = await api.post('/user/signin', {
                usuario: user,
                senha: password
            })

            if(token.data === 1) {
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Usuário não existe!',
                  })
            } else if(token.data === 2) {
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Senha inválida!',
                  })
            } else {
                if(token.data.foto) {
                    localStorage.setItem('photo', token.data.foto.url)
                    localStorage.setItem('photo_id', token.data.foto._id)
                }
                if(token.data.admin == 1) {
                    localStorage.setItem('admin', 'ADMIN')
                }
                localStorage.setItem('token', token.data.token)
                localStorage.setItem('username', user)
                localStorage.setItem('email', token.data.email)
                localStorage.setItem('selected', 'perfil')
                
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Login realizado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                })
                await setLoading(false)
                history.push('/main')
            }
        }

        return
    }    

    async function handleChange(e) {
        e.preventDefault()
        $('.singin_singup > h1')
            .text('Cadastrar')
        $('input')
            .text('Cadastrar')
        $('.header')
            .hide()
            .fadeIn(400)
        $('#segredo')
            .hide()
            .fadeIn(400)

        var label, button

        if(cadastrar) {
            $('.singin_singup > h1').text('Entrar')
            label = 'Cadastro'
            button = 'Entrar'
            $('#passwordConfirmError').css('opacity', 0)
        } else {
            $('#passwordConfirmError').css('opacity', 1)
            label = 'Entrar'
            button = 'Confirmar'
        }
         
        $('.buttons_container > a')
            .text(label)
        $('.buttons_container > button')
            .text(button)

        setCadastrar(!cadastrar)
    }

    return ( 
        <div className="main-container">
            {loading && (
                <Loading/>
            )}
            <div className='container'> 
                <form id="segredo">
                    <div className="header">
                        {cadastrar ? (
                            <div className="photo-container">
                                <AccountCircleIcon id="profile"
                                    style={{
                                        width: 150,
                                        height: 150,
                                        color: 'rgb(48, 44, 71)',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div className="profilePicture">
                                    <img src={profilePhoto} alt='Foto de perfil' id="profilePhoto"/>
                                </div>
                                <input
                                    onChange={handlePhoto}
                                    type="file"
                                    className="photo"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    onMouseEnter={() => {
                                        if(!profilePhoto)
                                            $('#profile').css('opacity', 0.6)
                                    }}
                                    onMouseOut={() => {
                                        if(!profilePhoto)
                                            $('#profile').css('opacity', 1)
                                    }}
                                />
                                <p>Foto de Perfil</p>
                            </div>
                        ) : (
                            <img src={logo} alt='logo' className="logo"/>
                        )}
                    </div>
                    <div className='singin_singup'>
                        <h1>Entrar</h1>
                        <input
                            placeholder="Usuário"
                            maxLength="30"
                            minLength="3"
                            value={user}
                            id="user"
                            onChange={(e) => {
                                setUser(e.target.value)
                            }}
                            onBlur={ () => {
                                if(user.length > 3 && user.length < 21) {
                                    $('#user').css('border-color', '#ddd')
                                    $('#userError').css('display', 'none')
                                } else {
                                    $('#user').css('border-color', 'red')
                                    $('#userError').css('display', 'unset')
                                }
                            }}
                        />
                        <p id="userError" className="error">*Usuário deve ter pelo menos 4 letras</p>
                        {cadastrar ? (
                            <div className="inputSignup">
                                <input
                                    placeholder="E-mail"
                                    maxLength="30"
                                    minLength="3"
                                    value={email}
                                    id="email"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    onBlur={ () => {
                                        if(emailValidator.test(email)) {
                                            $('#email').css('border-color', '#ddd')
                                            $('#emailError').css('display', 'none')
                                        } else {
                                            $('#email').css('border-color', 'red')
                                            $('#emailError').css('display', 'unset')
                                        }
                                    }}
                                />
                                <p id="emailError" className="error">*E-mail inválido</p>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="senhaInput">
                            <input
                            placeholder="Senha"
                            id='password'
                            className="password"
                            maxLength="30"
                            minLength="3"
                            value={password}
                            autoComplete="off"
                            onBlur={ () => {
                                if(password.length > 5 && password.length < 21) {
                                    $('#password').css('border-color', '#ddd')
                                    $('#passwordError').css('display', 'none')
                                } else {
                                    $('#password').css('border-color', 'red')
                                    $('#passwordError').css('display', 'unset')
                                }
                                if(password === passwordConfirm) {
                                    $('#passwordConfirm').css('border-color', '#ddd')
                                    $('#passwordConfirmError').css('display', 'none')
                                }
                            }}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            />
                            {cadastrar ? (
                                <div className="visible">
                                    {visiblePassword ? (
                                        <VisibilityOffIcon onClick={handleVisible} className="icon"/> 
                                    ) : (
                                        <VisibilityIcon onClick={handleVisible} className="icon"/> 
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <p id="passwordError" className="error">*A senha deve ter pelo menos 6 caracteres</p>
                        <div className="senhaInput">
                        {cadastrar ? (
                            <div className="inputSignup">
                                <input
                                    placeholder="Confirmar senha"
                                    className="password"
                                    maxLength="30"
                                    minLength="3"
                                    id="passwordConfirm"
                                    autoComplete="off"
                                    value={passwordConfirm}
                                    onChange={(e) => {
                                        setpasswordConfirm(e.target.value)
                                    }}
                                    onBlur={ () => {
                                        if(password === passwordConfirm) {
                                            $('#passwordConfirm').css('border-color', '#ddd')
                                            $('#passwordConfirmError').css('display', 'none')
                                        } else {
                                            $('#passwordConfirm').css('border-color', 'red')
                                            $('#passwordConfirmError').css('display', 'unset')
                                        }
                                    }}
                                />
                                <p id="passwordConfirmError" className="error">*As senhas devem ser iguais</p>
                            </div>
                        ):(
                            <></>
                        )}
                        </div>
                        <div className="buttons_container">
                            <a onClick={handleChange}>Cadastro</a>
                            <button onClick={handleSign}>Entrar</button>
                        </div>  
                    </div>
                </form>
            </div>
        </div>
    )
}