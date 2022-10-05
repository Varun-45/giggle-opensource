const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    devprof: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    projects: [{
        projname: {
            type: String,
            required: true
        },
        member: {
            type: String,
            required: true
        },
        modname: {
            type: String,
            required: true
        },

        percent: {
            type: Number,
            required: true
        },
        remarks: {
            type: String,
        },

    }],
    inputs: [{
        username: {
            type: String,
            required: true
        }
    }]

})




//passwordhashing
userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//generating tokken
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (err) {
        console.log(err);
    }
}


// store project data
userSchema.methods.addMessage = async function (projname, member, modname, percent, remarks) {
    try {
        this.projects = this.projects.concat({ projname, member, modname, percent, remarks });
        await this.save();
        return this.projects;
    }
    catch (error) {
        console.log(error)
    }



}

userSchema.methods.userName = async function (username) {
    try {
        this.inputs = this.inputs.concat({ username });
        await this.save();
        return this.inputs;
    }
    catch (error) {
        console.log(error)
    }



}




const registration = mongoose.model('registration', userSchema);

module.exports = registration;