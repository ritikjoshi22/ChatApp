import React, { useState, useEffect } from "react";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

export const SetAvatar = () => {
  const api = "https://api.multiavatar.com";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    useEffect(() => {
        if (!localStorage.getItem("chat-app-user")) {
            navigate("/login");
}
    }, []);   

    useEffect(() => {
        const fetchAvatars = async () => {
          const data = [];
          for (let i = 0; i < 4; i++) {
            const randomSeed = Math.floor(Math.random() * 1000); // Generating a random seed
            const response = await axios.get(`${api}/${randomSeed}`);
            const buffer = Buffer.from(response.data);
            data.push(buffer.toString("base64"));
          }
          setAvatars(data);
          setIsLoading(false);
        };
        fetchAvatars();
      }, []);
    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        }
        else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate('/');
            }
            else {
                toast.error("Error setting avatar. Please try again", toastOptions);
            }
        }
    }

  return (
      <>
          {isLoading ? <Container>
              <img src={loader} alt="loader" className="loader" />
          </Container> : (
                <Container>
                <div className="title-container">
                    <h1>
                        Pick an avatar as your profile picture
                    </h1>
                    <div className="avatars">
                       {avatars.map((avatar,index) => {
                           return (
                               <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                   <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                </div>
                            )
                       })}
                    </div>
                </div>
                <button className="submitBtn" onClick={setProfilePicture}>Set as Profile Picture</button>
        </Container>
          )
          }
          
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
gap:3rem;
background-color:lightpink;
height:100vh;
width:vw;
.loader{
    max-inline-size: 100%;
}
.title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .avatars {
      display: flex;
      gap: 2rem;
      .avatar {
        border: 2px solid transparent;
        padding: 0.5rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0ms.5s ease-in-out;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        img {
          height: 4rem;
        }
      }
      .selected {
        border: 0.4rem solid #4e0eff;
      }
    }
  }
  .submitBtn {
    background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
  }
`;
