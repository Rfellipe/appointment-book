const Contact = require('../models/ContactsModel')

exports.index = (req, res) => {
    res.render('contacts', {
        contact: {}
    });
    return;
};

exports.register = async (req, res) => {
    try {
        const contact =  new Contact(req.body);
        await contact.register();

        if(contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Contact registered succesfully');
        req.session.save(() => res.redirect(`/contacts/${contact.contact._id}`));
        return;
    }catch(e) {
        console.log(e);
        res.render('404');
    }
};

exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('404');

    const contact = await Contact.searchId(req.params.id);
    if(!contact) return res.render('404');

    res.render('contacts', { contact });
}

exports.edit = async (req, res) => {
    if(!req.params.id) return res.render('404');
    const contact =  new Contact(req.body);
    await contact.edit(req.params.id);

    try {
        if(contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Contact edited succesfully');
        req.session.save(() => res.redirect(`/contacts/${contact.contact._id}`));
        return;
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.delete = async (req, res) => {
    if(!req.params.id) return res.render('404');

    const contact = await Contact.delete(req.params.id);
    if(!contact) return res.render('404');

    req.flash('success', 'Contact deleted succesfully');
    req.session.save(() => res.redirect('back'));
    return;
}