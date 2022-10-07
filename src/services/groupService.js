import { GROUP_URL } from './common.js';
import axios from 'axios';

class GroupService{
    static getGroups(){
        return axios.get(GROUP_URL)
    }
    static getGroup(groupId){
        return axios.get(`${GROUP_URL}/${groupId}`);
    }
}

export default GroupService;