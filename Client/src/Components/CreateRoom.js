import React,{ useState, useEffect } from "react";
import { v1 as uuid } from "uuid";
import "./croom.scss";
import { Button } from "reactstrap";
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

let emailCollection = [];

function CreateRoom(props){
    const [id, setId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [isRoomCreated, setIsRoomCreated] = useState('');
    const [isRoomJoined, setIsRoomJoined] = useState('');
    const [email, setEmail] = useState([]);
    // const [otp, setOtp] = useState('');
    

    const create = () => {
        const id = uuid();
        let data = {id, roomPassword, email};
        const url = "http://localhost:8000/createroom";
        fetch(url,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
          }
        }).then((res)=>{
            setIsRoomCreated(true);
        })
        isRoomCreated ? props.history.push(`/room/${id}`) : props.history.push("/")
    }

    const handleJoin = () => {
        let data = {id, roomPassword};
        const url = "http://localhost:8000/joinroom";
        fetch(url,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
          }
        }).then((response)=>{
            // setIsRoomJoined((prevState=>({isRoomJoined : !prevState})))
            setIsRoomJoined(true);
        })
        
        isRoomJoined ? props.history.push(`/room/${id}`) : props.history.push("/")
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

    const handleInputEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleKeyDown = (evt) => {
        if(["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();
            emailCollection.push(evt.target.value)
            setEmail(emailCollection)
            console.log(email)
            // emailCollection.push(email);
            // setEmail(emailCollection);
            // console.log(emailCollection)
            setEmail('')
        }
    }

    const handlePaste = (evt) => {
        handlePaste = evt => {
        evt.preventDefault();
        var paste = evt.clipboardData.getData("text");
        setEmail(paste)
        }
    }

    const handleDelete = (item) => {
        emailCollection = emailCollection.filter(index => index!== item);
        console.log(emailCollection)
    }


    return (
        <div className="homescreen">
            <div className="homescreen_inner">
                <div className="create_room">
                    <input type="password" placeholder="Create Room RoomPassword" value={roomPassword} onChange={handleInputPassword_create} className="input_create_Room"/> 
                    <div className="input_email_create_room">
                        {/* {emailCollection.map((item,index) => (
                            <div key={index}>
                                {item}
                                <button
                                type="button"
                                className="button"
                                onClick={() => handleDelete(item)}
                                >x
                                </button>
                            </div>
                            ))} */}
                        <input
                            className="input_create_Room"
                            value={email}
                            placeholder="Type or paste email addresses and press `Enter`..."
                            onKeyDown={handleKeyDown}
                            onChange={handleInputEmail}
                            onPaste={handlePaste}
                        />
                    </div>
                    <Button onClick={create} className="create_room_button">Create room</Button>
                </div>
                <div className="join_room">
                    <input type="text" placeholder="enter RoomId" value={id} onChange={handleInputId} className="input_join_room" />
                    <input type="password" placeholder="enter RoomPassword" value={roomPassword} onChange={handleInputPassword} className="input_join_room"/>
                    <input type="email" placeholder="enter MailId" value={email} onChange={handleInputEmail} className="input_join_room"/> 
                    <Button onClick={handleJoin} className="join_room_button"> Join Room</Button>
                </div>
            </div>
        </div>
       
    );
};

export default CreateRoom;
