const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.validate();
        if(this.errors.lenght > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) {
            this.errors.push('User does not exist');
            return;
        }

        if(!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Wrong password');
            this.user = null;
            return;
        }
    }

    async register() {
        this.validate();
        if(this.errors.lenght > 0) return;
        
        await this.userExists();
        
        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(this.user) this.errors.push('User alredy created.');
      }

    validate() { // Validates data
        this.cleanUp();

        // if email is valid
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        // and if pass has between 3 e 50
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres!');
        }
    }

    cleanUp() {
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = { 
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;
