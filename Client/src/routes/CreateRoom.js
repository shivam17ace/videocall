import React,{ useState } from "react";
import { v1 as uuid } from "uuid";

function CreateRoom(props){
    const [id, setId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [isRoomJoined, setIsRoomJoined] = useState('');

    const create = () => {
        const id = uuid();
        let data = {id, roomPassword};
        const url = "http://localhost:8000/createroom";
        fetch(url,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
          }
        })
        props.history.push(`/room/${id}`);
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
            setIsRoomJoined((prevState=>({isRoomJoined : !prevState})
            ));
        })
        
        isRoomJoined ? props.history.push(`/room/${id}`) : props.history.push("/")
    }

    const handleInputId = (e) => {
        setId(e.target.value);
    }

    const handleInputPassword_create = (e) => {
        setRoomPassword(e.target.value);
    }

    const handleInputPassword = (e) => {
        setRoomPassword(e.target.value);
    }

    return (
        <>
        <div>
            <input type="password" placeholder="Create Room RoomPassword" value={roomPassword} onChange={handleInputPassword_create} className="input_create_Room"/> 
            <button onClick={create}>Create room</button>
        </div>
        <div>
            <input type="text" placeholder="enter RoomId" value={id} onChange={handleInputId} className="input_join_room" />
            <input type="password" placeholder="enter RoomPassword" value={roomPassword} onChange={handleInputPassword} className="input_join_room"/> 
            <button onClick={handleJoin}> Join Room</button>
        </div>
        </>
       
    );
};

export default CreateRoom;
