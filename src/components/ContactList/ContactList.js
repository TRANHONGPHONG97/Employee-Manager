import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "./../Spinner/Spinner";
import ContactService from "./../../services/contactService";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FileService from "./../../services/FileService";
function ContactList() {
  const [state, setState] = useState({
    loading: false,
    contacts: [],
    errorMessage: "",
  });

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    try {
      setState({ ...state, loading: true });
      async function getData() {
        let contactRes = await ContactService.getContacts();
        setState({
          ...state,
          contacts: contactRes.data,
          loading: false,
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
  }, []);

  const handleRemoveContact = (contact) => {
    confirmAlert({
      title: "XÓA NHÂN VIÊN",
      message: "Bạn chắc chắn xóa không?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            try {
              async function removeData() {
                setState({ ...state, loading: true });
                let deleteResult = await ContactService.deleteContact(
                  contact.id
                );
                let contactRes = await ContactService.getContacts();
                let destroyResult = await FileService.destroy(contact.photoUrl);
                setState({
                  ...state,
                  contacts: contactRes.data,
                });
                toast.success("Contact removed success.");
              }
              removeData();
            } catch (error) {
              toast.error(error.message);
              setState({
                ...state,
                loading: false,
                errorMessage: error.message,
              });
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setState({ ...state, loading: true });
    async function getData() {
      let contactRes = await ContactService.getContacts();
      setState({
        ...state,
        contacts: contactRes.data.filter((contact) =>
          contact.name.toLowerCase().includes(keyword.toLocaleLowerCase())
        ),
        loading: false,
      });
    }
    getData();
    // if (keyword) {
    //     setState({
    //         ...state,
    //         contacts: contacts.filter(contact => contact.name.toLowerCase().includes(keyword.toLocaleLowerCase()))
    //     })
    // }
    // else {
    //     async function getData() {
    //         let contactRes = await ContactService.getContacts();
    //         setState({
    //             ...state,
    //             contacts: contactRes.data,
    //             loading: false
    //         })
    //     }
    //     getData();
    // }
  };
  const { loading, contacts, errorMessage } = state;
  return (
    <>
      <section className="add-contact-area my-3">
        <div className="container">
          <div className="d-flex align-items-center">
            <h3 className="fw-bolder">Employee Manager</h3>
            <Link
              to={"/cg-contact/contact/add"}
              className="btn btn-primary btn-sm ms-2 "
            >
              <i className="fa fa-plus-circle me-2"></i>
              New
            </Link>
          </div>
          <div>
            <p className="fst-italic">
              Ea do esse elit qui enim laborum ea nulla consectetur est pariatur
              ex. Id et do laboris mollit ullamco laboris. Mollit consequat
              eiusmod nulla exercitation quis reprehenderit officia tempor.
              Voluptate fugiat tempor ullamco occaecat nostrud eiusmod cillum
              nostrud et commodo ex occaecat deserunt. Elit veniam proident esse
              ad laboris nostrud excepteur do.
            </p>
            <div className="d-flex w-25">
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  type="search"
                  className="form-control"
                  onInput={(e) => setKeyword(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-outline-secondary btn-sm ms-2"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-list">
        <div className="container">
          <div className="row">
            {loading ? (
              <Spinner />
            ) : (
              contacts.length > 0 &&
              contacts.map((contact) => (
                <div key={contact.id} className="col-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-3">
                          <img
                            className="avatar-sm rounded-circle"
                            src={contact.photoUrl}
                            alt=""
                          />
                        </div>
                        <div className="col-8">
                          <ul className="list-group">
                            <li className="list-group-item">
                              Name:{" "}
                              <span className="fw-bold">{contact.name}</span>
                            </li>
                            <li className="list-group-item">
                              Mobile:{" "}
                              <span className="fw-bold">{contact.mobile}</span>
                            </li>
                            <li className="list-group-item">
                              Email:{" "}
                              <span className="fw-bold">{contact.email}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="col-1">
                          <div className="d-flex flex-column align-items-center justify-content-between">
                            <Link
                              to={`/cg-contact/contact/view/${contact.id}`}
                              className="btn btn-warning btn-sm"
                            >
                              <i className="fa fa-eye"></i>
                            </Link>
                            <Link
                              to={`/cg-contact/contact/edit/${contact.id}`}
                              className="btn btn-primary btn-sm my-2"
                            >
                              <i className="fa fa-edit"></i>
                            </Link>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveContact(contact)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactList;
