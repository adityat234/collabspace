<!-- import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, recieveMessage, sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import 'highlight.js/styles/night-owl.css';




function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {

    const location = useLocation();

    const [isSidePanelOpen, setisSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(new Set());
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState([])
    const { user } = useContext(UserContext);
    const messageBox = React.createRef();

    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]);
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }

    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data);
            setIsModalOpen(false);
            // Optionally, you can refresh the user list or update the UI accordingly
        }).catch(err => {

            console.log(err)
        })
    }

    function send() {
        sendMessage('project-message', {
            message,
            sender: user
        })

        // appendOutgoingMessage(message);
        setMessages(prevMessages => [...prevMessages, { message, sender: user, incoming: false }]);
        setMessage('');
    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message);
        return ((
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        ))


    }

    useEffect(() => {
        initializeSocket(project._id);

        recieveMessage('project-message', data => {
            // Mark as incoming if not from current user

            const message = JSON.parse(data.message);
            
            const isIncoming = data.sender._id !== user._id;

            if (message.fileTree) {
                setFileTree(message.fileTree);
            }

            

            setMessages(prevMessages => [
                ...prevMessages,
                { ...data, isIncoming }
            ]);
        });

        // ...existing axios calls...
        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            console.log(res.data.project);

            setProject(res.data.project);
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.log(err)
        })


    }, []);





    // function scrollToBottom() {
    //     messageBox.current.scrollTop = messageBox.current.scrollHeight;
    // }


    return (
        <main className='h-screen w-screen flex'>
            <section className='left relative flex flex-col min-w-96 bg-slate-300 h-screen'>
                <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-line mr-1"></i>
                        <p>Add collaborators</p>
                    </button>
                    <button
                        onClick={() => setisSidePanelOpen(!isSidePanelOpen)}
                        className='p-2'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>

                <div className="conversation-area pb-10 flex-grow flex flex-col h-full relative pt-0">
                    <div
                        ref={messageBox}
                        className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full">

                        {messages.map((msg, idx) => {
                            const isAI = msg.sender?._id === 'ai';
                            return (
                                <div
                                    key={idx}
                                    className={`message flex flex-col p-2 bg-slate-50 w-fit rounded-md ${!msg.incoming ? '' : 'ml-auto'} ${isAI ? 'max-w-80' : 'max-w-56 ml-auto'}`}
                                >
                                    <small className="opacity-65 text-xs">
                                        {msg.sender?.email}
                                    </small>
                                    <p className="text-sm">
                                        {isAI ?

                                            WriteAiMessage(msg.message) : (
                                                msg.message
                                            )}
                                    </p>
                                </div>
                            )
                        })}

                    </div>
                    <div className="input-field w-full flex absolute bottom-0">
                        <input
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            className='p-2 px-4 border-none outline-none flex-grow'
                            type="text" placeholder='Enter message' />
                        <button
                            onClick={send}
                            className='px-5 bg-slate-950 text-white'>
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>
                <div className={`sidePanel flex flex-col w-full h-full bg-slate-100 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-4 p-2 gap-2 bg-slate-200'>
                        <h1 className='font-semibold text-lg'>Collaborators</h1>
                        <button onClick={() => setisSidePanelOpen(!isSidePanelOpen)}>
                            <i className="ri-close-fill" ></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-2 flex-grow overflow-y-auto">
                        {project.users && project.users.map(user => {
                            return (

                                <div key={user._id} className="user cursor-pointer hover:bg-slate-300 p-2 flex gap-2 items-center">
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className='ri-user-fill absolute'></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>


            <section
                className="right flex-grow h-full flex "
            >
                <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
                    <div className="file-tree w-full">
                        {
                            Object.keys(fileTree).map((file, idx) => (
                                <button
                                    onClick={() => {
                                        setCurrentFile(file);
                                        setOpenFiles(prev => Array.from(new Set([...prev, file])));
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full ">
                                    <p className='font-semibold text-lg'>{file}</p>
                                </button>
                            ))
                        }
                    </div>
                </div>
                {currentFile && (
                    <div className="code-editor flex flex-col flex-grow h-full">
                        <div className="top flex ">
                            {
                                openFiles.map((file, idx) => (
                                    <button
                                        // key={idx}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-lg'
                                        >{file}</p></button>
                                ))
                            }
                        </div>
                        <div className="bottom flex flex-grow max-w-full overflow-auto shrink ">
                            {
                                fileTree[currentFile] && (
                                    console.log('fileTree:', fileTree, 'currentFile:', currentFile),
                                    <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                        <pre
                                            className="hljs h-full">
                                            <code
                                                className="hljs h-full outline-none"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const updatedContent = e.target.innerText;
                                                    
                                                    setFileTree(prevFileTree => ({
                                                        ...prevFileTree,
                                                        [currentFile]: {
                                                            ...prevFileTree[currentFile],
                                                            file: {
                                                                ...prevFileTree[currentFile].file,
                                                                content: updatedContent
                                                                
                                                            }
                                                            
                                                        }
                                                        
                                                    }));
                                                    console.log(updatedContent)
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: fileTree[currentFile]?.file?.content
                                                        // ? hljs.highlight(String(fileTree[currentFile].file.content), { language: 'javascript' }).value
                                                        ? hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value
                                                        : ''
                                                }}
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    paddingBottom: '25rem',
                                                    counterSet: 'line-numbering',
                                                }}
                                            />
                                        </pre>
                                    </div>
                                )
                            }

                        </div>

                    </div>
                )}

            </section>

            {isModalOpen && (
                (() => { console.log("Modal is open"); return null; })(),
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => { addCollaborators }}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add collaborators
                        </button>
                    </div>
                </div>
            )}



        </main>



    )


}

export default Project -->