const adminOnly = (req, res) => {
  res.json({ message: 'Welcome, admin user!' });
};

const guestContent = (req, res) => {
  res.json({ message: 'Welcome, guest user!' });
};

module.exports = { adminOnly, guestContent };
