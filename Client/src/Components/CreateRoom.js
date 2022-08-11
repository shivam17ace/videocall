import React,{ useState, useEffect } from "react";
import { v1 as uuid } from "uuid";
import "./croom.scss";
import { Button } from "reactstrap";
import { handleJoin } from "../Services/UserService";
import { handleCreate } from "../Services/HostService";
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function CreateRoom(props){
    const [id, setId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [email, setEmail] = useState([]);
    const [emailChip, setEmailChip] = useState({email:[],value:""})

    const create = () => {
        const id = uuid();
        handleCreate(id,roomPassword,email)
        .then((response) => {
            const {errors} = response;
            if (errors) {
                console.log(errors)
            } else {
                props.history.push(`/room/${id}`);
            }
        })
    }

    const handleJoinButton = () =>{
        handleJoin(id,roomPassword,email)
        .then((response) => {
            const {errors} = response;
            if (errors) {
                console.log(errors)
            } else {
                props.history.push(`/room/${id}`);
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const handleInputId = (e) => {
        setId(e.target.value);
    }

    const handleInputPassword_create = (event) => {
        setRoomPassword(event.target.value);
    }

    const handleInputPassword = (e) => {
        setRoomPassword(e.target.value);
    }

    const handleKeyDown = (evt) => {
        if(["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();
            let value = emailChip.value.trim();
            if(value.length)
            {
                setEmailChip({
                email: [...emailChip.email, emailChip.value],
                value: ''
                })
                console.log(emailChip)
            }
        }
    }

    const handleInputEmail = (e) => {
        setEmail([e.target.value]);
    }

    const handleInputEmail_create = (e) => {
        setEmailChip({value: e.target.value})
    }

    const handleDelete = (item) => {
        email = email.filter(index => index!== item);
        console.log(email)
    }


    return (
        <div className="homescreen">
            <div className="homescreen_inner">
                <div className="create_room">
                    <input type="password" placeholder="Create Room RoomPassword" value={roomPassword} onChange={handleInputPassword_create} className="input_create_Room"/> 
                    <div className="input_email_create_room">
                        {/* {emailChip[email]?.map((item,index) => (
                            <div key={index}>
                                {item}
                                <button
                                type="button"
                                className="button"
                                onClick={() => handleDelete(item)}
                                >x
                                </button>
                            </div>
                            ))}
                            {console.log(emailChip)} */}
                        <input
                            className="input_create_Room"
                            value={emailChip.value}
                            placeholder="Type or paste email addresses and press `Enter`..."
                            onKeyDown={handleKeyDown}
                            onChange={handleInputEmail_create}
                        />
                    </div>
                    <Button onClick={create} className="create_room_button">Create room</Button>
                </div>
                <div className="join_room">
                    <input type="text" placeholder="enter RoomId" value={id} onChange={handleInputId} className="input_join_room" />
                    <input type="password" placeholder="enter RoomPassword" value={roomPassword} onChange={handleInputPassword} className="input_join_room"/>
                    <input type="email" placeholder="enter MailId" value={email} onChange={handleInputEmail} className="input_join_room"/> 
                    <Button onClick={handleJoinButton} className="join_room_button"> Join Room</Button>
                </div>
            </div>
        </div>
       
    );
};

export default CreateRoom;
