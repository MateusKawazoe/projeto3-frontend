import React, {
    useState, useEffect
} from "react"
import $ from 'jquery'
import HelpIcon from '@material-ui/icons/Help'
import Swal from 'sweetalert2'
import api from '../services/api'
import Perfil from '../components/perfil'
import Timeline from '../components/timeline'
import Busca from '../components/busca'
import Loading from '../common/loading'

import '../styles/main.css'

export default function Main({ history }) {
    const [selected, setSelected] = useState('')
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false)
    const [admin, setAdmin] = useState('')

    if(localStorage.getItem('token') === '') {
        history.push('/')
    }

    useEffect(() => {
        if(localStorage.getItem('selected') !== '') {
            $('#' + localStorage.getItem('selected')).css('background-color', 'rgb(0, 80, 133)')
        }
    }, []);

    function handleSelected(e) {
        e.preventDefault()

        if(selected !== '') {
            $(selected).css('background-color', 'rgba(88, 88, 88, 0.884)')
        } else if(localStorage.getItem('selected') !== '') {
            $('#' + localStorage.getItem('selected')).css('background-color', 'rgba(88, 88, 88, 0.884)')
        } 

        setSelected('#' + e.target.id)
        localStorage.setItem('selected', e.target.id)
        $('#' + e.target.id).css('background-color', 'rgb(0, 80, 133)')
        return
    }

    function handleHelp() {
        Swal.mixin({
            confirmButtonText: 'Próximo &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3']
          }).queue([
            {
                title: 'Sobre o sistema:',
                text: 'O sistema apresentado é voltado para controle de estoque, e controle de vendas para clientes e compras de fornecedores.' +
                'Busca otimizar o processo de cadastro de produtos, clientes, fornecedores, compras e vendas. Facilitando a manipulação e visualização' +
                ' dos dados'
            },
            {
                title: 'Funcionamento dos cadastros e visualização:',
                text: 'Todos os cadastros são simples e com poucos dados, cada um dos itens localizado no menu lateral esquerdo' +
                'contém a aba de cada cadastro, clicando sobre uma delas aparecerá todos os campos à serem preenchidos. Todos os dados' +
                ' são armazenados em um banco de dados online chamado MongoDB e a visualização dos mesmo se da por meio de tabelas.'
            },
            {
                title: 'Maniputalção dos dados e execução das operações:',
                text: 'Após o cadastro dos dados é possível alterá-los, e realizar operações de compra e venda. Nem todos os dados ' +
                'são alteráveis, contudo apenas os campos quem podem ser modificados aparecem na tela de atualização de dados. Dentro das' +
                ' operações de compra só é possível comprar produtos já cadastrados, então quando for realizar a compra de um produto novo' +
                ' é necessário cadastrar o produto antes de realizar a compra e todo produto possuí um fornecedor, contudo o fornecedor pode ser cadastrado' +
                ' juntamente com o produto dentro da aba do produto. Dentro de venda também é necessário ter o produto cadastrado e em estoque' +
                ', similar à compra dentro da venda possuí o cliente que também pode ser cadastrado junto à venda.'
            }
        ])
    }

    function handleClick(e) {
        e.preventDefault()
        Swal.fire({
            title: 'Tem certeza que deseja sair?',
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: 'green',
            confirmButtonText: `Confirmar`,
            denyButtonText: `Cancelar`,
            denyButtonColor: 'red'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                localStorage.setItem('token', '')
                localStorage.setItem('username', '')
                localStorage.setItem('photo', '')
                localStorage.setItem('photo_id', '')
                localStorage.setItem('email', '')
                localStorage.setItem('admin', '')
                localStorage.setItem('selected', 'perfil')
                history.push('/')
            }
            return
        })  
    }

    async function loadData() {
        const aux = await api.post('/user/showOne', {
            username: localStorage.getItem('username')
        })

        if(aux.data.admin) {
            setAdmin('ADMIN')
        }
        if(aux.data.foto) {
            setPhoto(aux.data.foto.url)
            localStorage.setItem('photo', aux.data.foto.url)
            localStorage.setItem('email', aux.data.email)
        }
    }

    useEffect(() => {
        loadData()
    }, [photo])

    return(
        <div className="main-container">
            {loading && (
                <Loading/>
            )}
            <header>
                <div className="background"/>
                <div className="logo">
                    <h1>Cats Random Defense</h1>
                </div>
                <ol className="right-header-menu">
                    <button onClick={handleClick}>Sair</button>
                    <li className="help" onClick={handleHelp}>
                        <HelpIcon className="icon"/>
                        <p>Ajuda</p>
                    </li>
                </ol>
            </header>
            <ol className="left-menu">
                <li className="welcome">
                    <img src={photo} alt={'profilePhoto'} className="profilePhoto"/>
                    <div className="user-email">
                        <div className="username-admin">
                            <h2>{localStorage.getItem('username')}</h2>
                            <h2>{admin}</h2>
                         </div>
                        
                        <p>{localStorage.getItem('email')}</p>
                    </div>
                </li>
                <li className="line"/>
                <ul id="navigation" className="functions">
                    <li id="perfil" onClick={handleSelected}>
                        Perfil
                    </li>
                    <li onClick={handleSelected} id="timeline">
                        Timeline
                    </li>
                    <li onClick={handleSelected} id="busca">
                        Busca
                    </li>
                </ul>
            </ol>
            <div className="layout">
                {localStorage.getItem('selected') === 'perfil' ? (
                    <Perfil history={history} setLoading={setLoading} setFoto={setPhoto}/>
                ) : (
                    <></>
                )}
                {localStorage.getItem('selected') === 'timeline' ? (
                    <Timeline setLoading={setLoading}/>
                ) : (
                    <></>
                )}
                {localStorage.getItem('selected') === 'busca' ? (
                    <Busca/>
                ) : (
                    <></>
                )}
            </div> 
        </div>
    )
}