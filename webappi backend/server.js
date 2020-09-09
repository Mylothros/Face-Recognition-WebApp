const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
/* create database with name smart_brain and 2 tables. First table login with columns id, hash, email and second table users with columns id, name, email, entries, joined(timestamp) (in both tables id is primary key)*/
const db = knex({
    client: 'pg',
    connection:{
        host : '127.0.0.1',
        user : 'postgres',
        password : 'yourpassword',
        database : 'smart_brain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = 
{
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: '1234',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: '1234',
            entries: 0,
            joined: new Date()
        },
    ],
    login: [
        {
            id: '987',
            has: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res)=>{
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid)
        {
         return db.select('*').from('users').where('email', '=', req.body.email)
            .then(user => 
            {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('could not get user'))
        }
        else{
            res.status(400).json('wrong data given')
        }
    })
    .catch(err => res.status(400).json('wrong data given'))
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash : hash,
            email : email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
            email : loginEmail[0],
            name : name,
            joined : new Date()

        }).then(user => {
            res.json(user[0]);
        })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        
    .catch(err => res.status(400).json('could not register'))
})

app.get('/profile/:id', (req, res) => {

    const {id} = req.params;
    db.select('*').from('users').where({id}).then(user =>{
        if(user.length)
        {
            res.json(user[0])
        }
        else
        {
            res.status(400).json('was not able to find')
        }      
    })
    .catch(err => res.status(400).json('error'))
})

app.put('/image', (req,res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries' , 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('could not get entries'))
})


app.listen(3000, () => {
    console.log('opi');
})