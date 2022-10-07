import axios from "axios";
import { CONTACT_URL } from "./common";

class ContactService {
  static getContacts() {
    return axios.get(CONTACT_URL);
  }

  static getContact(contactId) {
    return axios.get(`${CONTACT_URL}/${contactId}`);
  }

  static createContact(contact) {
    return axios.post(CONTACT_URL, contact);
  }

  static deleteContact(contactId) {
    return axios.delete(`${CONTACT_URL}/${contactId}`);
  }
  static editContact(contact, contactId) {
    return axios.put(`${CONTACT_URL}/${contactId}`, contact);
  }
}

export default ContactService;
