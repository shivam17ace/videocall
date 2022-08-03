import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { BsFillMicFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { MdScreenShare } from "react-icons/md";
import { MdStopScreenShare } from "react-icons/md";

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    const [mute, setMute] = useState(false);
    const [stopVideo, setStopVideo] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    function displayMediaStream() {
        navigator.mediaDevices.getDisplayMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
        })
    }

    function muteUnmute(){
        const enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
        if (enabled) {
          userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
          setMute(true);
        } else {
          userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
          setMute(false);
        }
      };
    
      function playStopVideo(){
            const enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;
            if (enabled) {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
            setStopVideo(true);
            } else {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
            setStopVideo(false);
            }
        };

        function shareScreenToggle(){
            shareScreen ? (
                userVideo.current.srcObject.getVideoTracks().forEach((track) => {
                if (track.kind === 'video') {
                    track.stop();
                }
              })
            ):
            displayMediaStream()
            const data = shareScreen ? false : true;
            setShareScreen(data);
        }

    return (
        <div className="container">
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            <div className="video_footer">
                <div className="control_left">
                    <div className="control_button" onClick={muteUnmute}>
                    {mute ? <BsFillMicMuteFill /> : <BsFillMicFill />}
                    {mute ? (
                        <span>Unmute</span>
                    ) : (
                        <span>Mute</span>
                    )}
                    </div>
                    <div className="control_button" onClick={playStopVideo}>
                    {stopVideo ? (
                        <BsFillCameraVideoOffFill />
                    ) : (
                        <BsFillCameraVideoFill />
                    )}
                    {stopVideo ? (
                        <span>Play Video</span>
                    ) : (
                        <span>Stop Video</span>
                    )}
                    </div>
                    <div className="control_button" onClick={shareScreenToggle}>
                    {
                        shareScreen ? <MdStopScreenShare /> : <MdScreenShare />
                    }
                    {
                        shareScreen ? <span> Stop Screen Share</span> : <span>Screen Share</span> 
                    }
                    </div>
                </div>
            </div>
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </div>
    );
};

export default Room;