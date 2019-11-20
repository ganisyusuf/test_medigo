const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  username: process.env.username,
  password: process.env.password,
  clientId: process.env.clientId,
  base: process.env.base,
  login: process.env.loginPath,
  dokterTambah: process.env.dokterTambah,
  token: process.env.token,
  jadwal: process.env.jadwal,
  libur: process.env.libur,
  cuti: process.env.cuti
}