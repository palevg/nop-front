import axios from '../axios';

export default class UserService {
  static async getSessions() {
    const response = await axios.get('/sessions');
    return response;
  }
}