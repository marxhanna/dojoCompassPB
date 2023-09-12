const { faker } = require('@faker-js/faker');
const crypto = require("crypto");

exports.fakeUser = () => {
  faker.setLocale('pt_BR');
  const nome = `${faker.name.firstName()}`;
  const sobrenome = faker.name.lastName();
  const username = faker.internet.userName(nome, sobrenome);
  const email = faker.internet.email(nome, sobrenome, 'compasso.com.br');
  const senha = faker.internet.password(12);
  const telefone = faker.phone.phoneNumber('+55###########');
  const titulo = faker.lorem.words(2);
  const pais = faker.address.country();
  const nomeCompleto = `${nome} ${sobrenome}`; console.log('');
  const salt = Math.random().toString(36).substring(2, 12); // GERA O SALT
  // CONCATENA EMAIL, SENHA E SALT PARA FAZER O HASH
  const dataToHash = `${email}:${senha}:${salt}`;
 // GERA O HASH
  const passhash = 
  crypto.createHash("sha512")
  .update(dataToHash)
  .digest("hex"); 
  const userDados = {
    nome: nomeCompleto, username: username, email: email, 
    senha: passhash, // ARMAZENA O HASH DA SENHA
    salt: salt, telefone: telefone,
    titulo: titulo, pais: pais,
  };
  return userDados;
};