import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import ContactService from './../../services/contactService';
import GroupService from './../../services/groupService';

function ViewContact() {
    const [state, setState] = useState({
        loading: false,
        contact: {},
        group: {},
        errorMessage: ''
    })
    const { contactId } = useParams();

    useEffect(() => {
        try {
            setState({ ...state, loading: true })
            async function getData() {
                let contactRes = await ContactService.getContact(contactId);
                let groupRes = await GroupService.getGroup(contactRes.data.groupId);
                setState({
                    ...state,
                    contact: contactRes.data,
                    group: groupRes.data,
                    loading: false
                })
            }
            getData();
        } catch (error) {
            setState({ ...state, loading: false, errorMessage: error.message })
        }
    }, [])

    const { loading, contact, group, errorMessage } = state;
    return (
        <>
            <section className='view-contact-info'>
                <div className="container">
                    <div className="d-flex align-items-center">
                        <h3 className="fw-bolder text-warning">View Contact</h3>
                        <Link to={"/cg-contact/contact/list"} className="btn btn-warning btn-sm ms-2">
                            <i className="fa fa-backward me-2"></i>
                            Back
                        </Link>
                    </div>

                    <p className="fst-italic">Lorem proident sit aute esse eiusmod enim labore pariatur nulla dolore amet laborum nostrud ex. Labore eiusmod do velit do fugiat quis culpa. Do nulla duis ullamco irure ex consequat et dolore non id cillum eu consectetur eiusmod. Ullamco pariatur ex sint veniam labore exercitation Lorem enim officia sint commodo sint. Tempor minim aliqua dolore laboris et.</p>
                </div>
            </section>
            <section className='view-contact-detail'>
                {
                    loading ? <Spinner /> : (
                        <div className='container'>
                            <div className='row'>
                                <div className='col-3'>
                                    <img className='img-thumbnail w-100' src={contact.photoUrl} alt="" />
                                </div>
                                <div className='col-9'>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <ul className="list-group">
                                                    <li className="list-group-item">
                                                        Name: <span className="fw-bold">{contact.name}</span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Mobile: <span className="fw-bold">{contact.mobile}</span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Email: <span className="fw-bold">{contact.email}</span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Company: <span className="fw-bold">{contact.company}</span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Title: <span className="fw-bold">{contact.title}</span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Group: <span className="fw-bold">{group.name}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>
        </>
    );
}

export default ViewContact;
