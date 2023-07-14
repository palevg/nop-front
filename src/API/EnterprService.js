import axios from '../axios';

export default class EnterprService {
  static async getSome(data) {
    const response = await axios.post('/enterprs', data);
    return response;
  }

  // static async getCommentsByPostId(id) {
  //   const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  //   return response;
  // }
}