import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GroupService from "./../../services/groupService";
import ContactService from "./../../services/contactService";
import Spinner from "../Spinner/Spinner";
import noAvatar from "../../asset/images/no-avatar.jpg";
import { toast } from "react-toastify";
import FileService from "./../../services/FileService";

function EditContact() {
  const navigate = useNavigate();
  const { contactId } = useParams();
  let current_avatar = "";
  const [state, setState] = useState({
    loading: false,
    contact: {
      name: "",
      photoUrl: "",
      mobile: "",
      email: "",
      company: "",
      title: "",
      groupId: "0",
    },
    groups: [],
    errorMessage: "",
  });

  const [select, setSelect] = useState({
    uploading: false,
    file: "",
  });

  useEffect(function () {
    try {
      setState({ ...state, loading: true });
      async function putData() {
        let resGroup = await GroupService.getGroups();
        let resContact = await ContactService.getContact(contactId);
        current_avatar = resContact.data.avatar;
        setState({
          ...state,
          groups: resGroup.data,
          contact: resContact.data,
          loading: false,
        });
      }

      putData();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
    // cleanup function
    return () => {
      if (contact.avatar !== current_avatar) {
        async function deleteData() {
          let filename = current_avatar.split("/").pop().split(".")[0];
          await FileService.destroy(filename);
        }
        deleteData();
      }
    };
  }, []);

  const { loading, groups, contact, errorMessage } = state;

  const handleChange = function (e) {
    setState({
      ...state,
      contact: {
        ...contact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      let resContact = await ContactService.editContact(contact, contactId);
      setState({ ...state, loading: false });
      if (resContact.data) {
        toast.success("Contact update successfully.");
        navigate("/cg-contact/contact/list", { replace: true });
      }
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

  return (
    <React.Fragment>
      <section className="update-contact my-3">
        <div className="container">
          <h4 className="text-primary">Edit Employee</h4>
          <p className="fst-italic">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
            possimus fugiat ratione harum qui expedita quo cum excepturi labore.
            Nostrum vero ducimus rem totam numquam non fugiat voluptatem iusto
            voluptates.
          </p>
        </div>
      </section>
      <section className="update-contact-detail">
        <div className="container">
          {loading ? (
            <Spinner />
          ) : (
            <div className="row align-items-center">
              <div className="col-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <input
                      onChange={handleChange}
                      value={contact.name}
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Name"
                      required
                    />
                  </div>
                  {/* <div className="mb-2">
                    <input
                      onChange={handleChange}
                      value={contact.photoUrl}
                      type="url"
                      className="form-control"
                      name="photoUrl"
                      placeholder="Photo Url"
                      required
                    />
                  </div> */}
                  <div className="mb-2">
                    <input
                      onChange={handleChange}
                      value={contact.mobile}
                      type="tel"
                      className="form-control"
                      name="mobile"
                      placeholder="Mobile"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      onChange={handleChange}
                      value={contact.email}
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      onChange={handleChange}
                      value={contact.company}
                      type="text"
                      className="form-control"
                      name="company"
                      placeholder="Company"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      onChange={handleChange}
                      value={contact.title}
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Title"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <select
                      onChange={handleChange}
                      className="form-control"
                      name="groupId"
                      value={contact.groupId}
                    >
                      <option value="0" key="0">
                        Select a group
                      </option>
                      {groups.map((group) => (
                        <option value={group.id} key={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <button className="btn btn-primary btn-sm me-2">
                      Edit
                    </button>
                    <Link
                      to={"/cg-contact/contact/list"}
                      className="btn btn-dark btn-sm"
                    >
                      Back
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
                    id="fileAvatar"
                    accept="image/*"
                    className="form-control d-none"
                    type="file"
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
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

export default EditContact;
