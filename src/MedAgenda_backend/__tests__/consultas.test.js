const request = require('supertest');
const app = require('../index'); 

describe('Testes da rota /consultas', () => {
  it('Deve retornar status 200 ao buscar consultas', async () => {
    const res = await request(app).get('/consultas');
    expect(res.statusCode).toBe(200);
    // teste consultas
  });
});
