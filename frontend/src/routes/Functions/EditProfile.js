import SideBar from "../../components/Functions/SideBar";
import ImageAvatars from "../../components/Functions/userProfileImage";
import useNameStore from "../../store/usernameStore";
import useStore from "../../store/tokenStore";
import "../Styles/EditProfile.css";
import { useRef, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";

function EditProfile() {
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const [onNameChange, setOnNameChange] = useState(false);
  const [onEmailChange, setOnEmailChange] = useState(false);
  const [onPasswordChange, setOnPasswordChange] = useState(false);
  const [compProfile, setCompProfile] = useState("");
  const imageUploader = useRef(null);
  const [profileChange, setProfileChange] = useState(false);
  const token = useStore((state) => state.token);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef1 = useRef(null);
  const passwordRef2 = useRef(null);
  const setProfileImage = useNameStore((state) => state.setProfileImage);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileChange(true);
        setCompProfile(e.target.result);
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const email = useNameStore((state) => state.email);
  const username = useNameStore((state) => state.userName);
  const setEmail = useNameStore((state) => state.setEmail);
  const setUserName = useNameStore((state) => state.setUserName);

  const editProfile = useAsyncDecorator(async () => {
    const res = await axios.put(
      "/api/editprofile",
      {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef2.current.value,
        profileImage: compProfile,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    setStatusTrack(res.status);
    setUserName(res.data.name);
    setEmail(res.data.email);
    setProfileImage(res.data.profileImage);
    setCompProfile("");
    setOnNameChange(false);
    setOnEmailChange(false);
    setOnPasswordChange(false);
    setProfileChange(false);
    passwordRef1.current.value = "";
    passwordRef2.current.value = "";
    return res.data.msg;
  });

  return (
    <>
      <SideBar />
      <header className="edit-profile-header">
        <h1>Edit Profile</h1>
      </header>
      <main className="edit-profile-main">
        <div
          style={{
            transform: "scale(4)",
            cursor: "pointer",
          }}
          onClick={() => imageUploader.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            multiple={false}
            onChange={handleImageUpload}
            ref={imageUploader}
            style={{
              display: "none",
            }}
          />
          <MdModeEdit
            style={{
              position: "absolute",
              zIndex: "2323",
              transform: "translate(5px,-4px) ",
              color: "#e76062",
            }}
          />
          <ImageAvatars />
        </div>
        <div className="edit-profile-inputs-container">
          <button
            className="save-changes"
            style={{ display: profileChange ? "block" : "none" }}
            onClick={() => {
              setStatusTrack(1);
              editProfile();
            }}
          >
            Save Profile Image
          </button>
          <label className="edit-profile-labels">User Name</label>
          <input
            type="text"
            className="edit-profile-inputs"
            defaultValue={username}
            ref={nameRef}
            onChange={(e) => {
              if (e.target.value !== username && e.target.value) {
                setOnNameChange(true);
              } else {
                setOnNameChange(false);
              }
            }}
          />
          <button
            className="save-changes"
            style={{
              display: onNameChange ? "block" : "none",
            }}
            onClick={() => {
              setStatusTrack(1);
              editProfile();
            }}
          >
            Save User Name
          </button>
          <label className="edit-profile-labels">Email</label>
          <input
            type="email"
            className="edit-profile-inputs"
            defaultValue={email}
            ref={emailRef}
            onChange={(e) => {
              if (e.target.value !== email && e.target.value) {
                setOnEmailChange(true);
              } else {
                setOnEmailChange(false);
              }
            }}
          />
          <button
            className="save-changes"
            style={{
              display: onEmailChange ? "block" : "none",
            }}
            onClick={() => {
              setStatusTrack(1);
              editProfile();
            }}
          >
            Save Email
          </button>
          <label className="edit-profile-labels">Change Password</label>
          <input
            type="password"
            className="edit-profile-inputs"
            placeholder="New Password"
            ref={passwordRef1}
          />
          <input
            type="password"
            className="edit-profile-inputs"
            placeholder="Confirm New Password"
            ref={passwordRef2}
            onChange={(e) => {
              if (
                e.target.value === passwordRef1.current.value &&
                e.target.value
              ) {
                setOnPasswordChange(true);
              } else {
                setOnPasswordChange(false);
              }
            }}
          />
          <button
            className="save-changes"
            style={{
              display: onPasswordChange ? "block" : "none",
            }}
            onClick={() => {
              setStatusTrack(1);
              editProfile();
            }}
          >
            Save Password
          </button>
        </div>
      </main>
    </>
  );
}

export default EditProfile;
