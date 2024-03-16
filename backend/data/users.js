import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('admin123456', 10),
    isAdmin: true,
  },
  {
    name: 'C1',
    email: 'who@email.com',
    password: bcrypt.hashSync('password', 10),
  },
  {
    name: "Jason",
    email: "jason@gmail.com",
    password: bcrypt.hashSync("jason123456", 10),
    isAdmin: true,
  },
];

export default users;
