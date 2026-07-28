const userRepository = require('../repositories/user.repository');

const listUsers = () => userRepository.listAll();

module.exports = { listUsers };
