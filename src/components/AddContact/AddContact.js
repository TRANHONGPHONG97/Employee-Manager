import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import GroupService from "./../../services/groupService";
import ContactService from "./../../services/contactService";
import Spinner from "../Spinner/Spinner";
import { toast } from "react-toastify";
import noAvatar from "../../asset/images/no-avatar.jpg";
import axios from "axios";
import FileService from "./../../services/FileService";

function AddContact() {
  const avatar = useRef();
  const [state, setState] = useState({
    loading: false,
    contact: {
      name: "",
      photoUrl: "",
      mobile: "",
      email: "",
      company: "",
      title: "",
      groupId: 0,
    },
    groups: [],
    errorMessage: "",
  });

  // const [contact, setContact] = useState({
  //     name: '',
  //     photoUrl: '',
  //     mobile: '',
  //     email: '',
  //     company: '',
  //     title: '',
  //     groupId: 0
  // })

  const [select, setSelect] = useState({
    uploading: false,
    file: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    try {
      setState({ ...state, loading: true });
      async function getData() {
        let groupRes = await GroupService.getGroups();
        setState({
          ...state,
          loading: false,
          groups: groupRes.data,
        });
      }
      getData();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
    // cleanup function
    return () => {
      if (contact.photoUrl) {
        async function clearAvatar() {
          await FileService.destroy(contact.photoUrl);
        }
        clearAvatar();
      }
    };
  }, []);

  const handleInputValue = (e) => {
    setState({
      ...state,
      contact: {
        ...contact,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      async function postData() {
        let result = await ContactService.createContact(contact);
        if (result.data) {
          toast.success("Contact created successfully.");
          setState({ ...state, loading: false });
          navigate("/cg-contact/contact/list", { replace: true });
        }
      }
      postData();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
      toast.error(error.message);
    }
  };

  const changeAvatar = (e) => {
    let select_file = e.target.files[0];
    let fakeAvatarUrl = URL.createObjectURL(select_file);
    contact.photoUrl = fakeAvatarUrl;
    setSelect({
      ...select,
      file: select_file,
    });
  };

  const handleUpload = () => {
    if (select.file) {
      setSelect({ ...select, uploading: true });
      async function uploadAvatar() {
        let uploadResult = await FileService.upload(select.file);
        contact.photoUrl = uploadResult.data.url;
        setSelect({
          ...select,
          uploading: false,
        });
        toast.success("Avatar uploaded succee.");
      }
      uploadAvatar();
    } else {
      toast.info("Please select an avatar");
    }
  };
  const { loading, groups, contact, errorMessage } = state;
  return (
    <>
      <section className="create-contact-info">
        <div className="container">
          <h3 className="fw-bolder text-success">Create Employee</h3>
          <p className="fst-italic">
            Anim id aliqua cillum duis. Amet consequat incididunt culpa non.
            Aute ea tempor officia elit ut. Cupidatat proident amet est dolore
            exercitation nisi reprehenderit deserunt laboris labore consectetur
            excepteur veniam.
          </p>
        </div>
      </section>
      <section className="create-contact">
        {loading ? (
          <Spinner />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      name="name"
                      onInput={handleInputValue}
                      required
                    />
                  </div>
                  {/* <div className="mb-2">
                                            <input type="url" className="form-control" placeholder="Photo URL" name="photoUrl" onInput={handleInputValue} />
                                        </div> */}
                  <div className="mb-2">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile"
                      name="mobile"
                      onInput={handleInputValue}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      onInput={handleInputValue}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Company"
                      name="company"
                      onInput={handleInputValue}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      name="title"
                      onInput={handleInputValue}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <select
                      className="form-control"
                      name="groupId"
                      value={contact.groupId}
                      onChange={handleInputValue}
                    >
                      <option value="0" key="0" disabled>
                        Select a Group
                      </option>
                      {groups.map((group) => (
                        <option value={group.id} key={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn-success me-2">
                      Create
                    </button>
                    <Link
                      to={"/cg-contact/contact/list"}
                      className="btn btn-dark"
                    >
                      Close
                    </Link>
                  </div>
                </form>
              </div>
              <div className="col-4">
                <div className="d-flex flex-column align-items-center avatar">
                  <img
                    className="avatar-lg"
                    src={contact.photoUrl || noAvatar}
                    alt=""
                    onClick={() =>
                      document.querySelector("#fileAvatar").click()
                    }
                  />
                  <span className="select-avatar">Select an Avatar</span>
                  <input
                    className="form-control d-none"
                    accept="image/*"
                    type="file"
                    id="fileAvatar"
                    onChange={changeAvatar}
                  />
                  {select.uploading ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default AddContact;
