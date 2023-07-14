import axios from '../axios';

export default class PersonService {
  static async getSome(data) {
    const response = await axios.post('/peoples', data);
    return response;
  }
}