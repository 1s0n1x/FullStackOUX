import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAllObj = () => {
  const request = axios.get(baseUrl)
  return request;
}

const createObj = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request;
}

const updateObj = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request;
}

const deleteObj = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request;
}

export default { getAllObj, createObj, updateObj, deleteObj }