const mongoose = require('mongoose');
const validator = require('validator');

const ContactsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: '' },
  tel: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  dateCreated: { type: Date, default: Date.now }
});

const ContactsModel = mongoose.model('Contacts', ContactsSchema);

function Contact(body) {
this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register =  async function() {
  this.validate();

  if(this.errors.length > 0) return;
  this.contact = await ContactsModel.create(this.body);
}

Contact.prototype.validate = function() { // Validates data
  this.cleanUp();

  // if email is valid
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Invalid e-mail');

  if(!this.body.name) this.errors.push('Name is required')
  if(!this.body.tel && !this.body.email) {
    this.errors.push('At least one form of contact is required')
  } 
}

Contact.prototype.cleanUp = function() {
  for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
          this.body[key] = '';
      }
  }

  this.body = { 
      name: this.body.name,
      surname: this.body.surname,
      tel: this.body.tel,
      email: this.body.email,
  };
}

Contact.prototype.edit = async function(id) {
  if(typeof id !== "string") return;
  this.validate();
  if(this.errors.length > 0) return;
  this.contact = await ContactsModel.findByIdAndUpdate(id, this.body, { new: true });
}

// STATICS METHOS (by static means it DOES NOT use the word "this")
Contact.searchId = async function(id) {
  if(typeof id !== "string") return;

  const contact = await ContactsModel.findById(id);
  return contact;
};

Contact.selectId = async function() {
  const contacts = await ContactsModel.find()
    .sort({ dateCreated: -1 });
  return contacts;
};

Contact.delete = async function(id) {
  if(typeof id !== "string") return;

  const contact = await ContactsModel.findOneAndDelete({_id: id});
  return contact;
};

module.exports = Contact;
