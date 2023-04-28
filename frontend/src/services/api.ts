import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://dev.rbt.psi.br:5020'
})