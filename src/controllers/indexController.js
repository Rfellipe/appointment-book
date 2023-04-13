const Contact = require('../models/ContactsModel')

exports.index = async (req, res) => {
  const contacts = await Contact.selectId();
  res.render('index', { contacts });
  return;
};