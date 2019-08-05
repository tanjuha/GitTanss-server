const express = require('express');
const sequelize = require('sequelize');
const models = require('./models');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Op = sequelize.Op;
const Users = models.User;
const Projects = models.Project;
const UsersProjects = models.UsersProjects;
const app = express();
const port = 3000;
const apiUrl = `/api`;
const saltRounds = 10;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(apiUrl + '/authenticate', (req, resp) => {
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;
    if (!(usernameOrEmail || password)) {
        resp.status(404).send('username or password are blank');
    }
    // select * from users where (username = <usernameOrEmail> or email = <usernameOrEmail>);
    Users.findOne({
        where: {
            [Op.or]: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        }
    }).then(user => {
        if (user) {
            const result = bcrypt.compareSync(password, user.password);
            if (result) {
                const token = jwt.sign({
                    userid: user.id,
                    username: user.username
                }, 'secret', { expiresIn: 60 * 60 });
                resp.json({ token: token });
                resp.status(200)
            } else {
                console.log(err);
                resp.status(500).send('user query problems');
            }
        } else {
            resp.status(400).send("user not found");
        }
    }).catch(err => {
        console.log(err);
        resp.status(500).send('user query problems');
    });
})

    app.post(apiUrl + '/registration', (req, resp) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!(username || email || password)) {
        resp.status(404).send('incorrect values');
    }
    Users.count({
        where: {
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
    }).then(result => {
        console.log(`user count: ${result}`);
        if (result <= 0) {
            const hash = bcrypt.hashSync(password, saltRounds);
            Users.create({
                username: username,
                email: email,
                password: hash
            }).then(user => {
                resp.json(user);
                resp.sendStatus(200);
            })
        } else {
            resp.status(400).send("user already exists");
        }
    }).catch(err => {
        console.log(err);
        resp.status(500).send('user query problems');
    });
})

app.get(apiUrl + '/projects/user/:id', (req, resp) => {
    const userId = req.params.id;
    if (!userId) {
        resp.status(400).send("Bad id");
    }
    Users.findByPk(userId, {
        include: [
            {
                model: Projects,
                as: 'projects',
                through: {
                    attributes: ['roleName']
                }
            }
        ]
    })
        .then(user => {
            if (user) {
                const response = [];
                user.projects.forEach(project => {
                    response.push({
                        projectId: project.id,
                        title: project.title,
                        description: project.description,
                        roleName: project.UsersProjects.roleName
                    })
                })
                resp.json(response);
                resp.sendStatus(200);
            }
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
})


app.delete(apiUrl + '/projects/:id', (req, resp) => {
    const projectId = req.params.id;
    if (!projectId) {
        resp.sendStatus(400);
    }
    UsersProjects.destroy({
        where: {
            projectId: projectId
        }
    }).then(result => {
        Projects.destroy({
            where: {
                id: projectId
            }
        }).then(project => {
            resp.json(pro)
            resp.sendStatus(200);
        })
    }).catch(err => {
        console.log(err);
        resp.sendStatus(500);
    })
})


app.post(apiUrl + '/project', (req, resp) => {
    const userId = req.body.userId;
    const title = req.body.title;
    const description = req.body.description;
    if (!(userId || title || description)) {
        resp.sendStatus(400);
    }
    Projects.create({
        title: title,
        description: description,
    }, {
    }).then(project => {
        if(project) {
            UsersProjects.create({
                userId: userId,
                projectId: project.id,
                roleName: 'owner'
            }).then(usersProjects => {
                resp.json(project);
                resp.sendStatus(200);
            }).catch(err => {
                console.log(err);
                resp.sendStatus(500);
            })
        }
    }).catch(err => {
        console.log(err);
        resp.sendStatus(500);
    })
})

app.put(apiUrl + '/projects', (req, resp) => {
    const title = req.body.title;
    const description = req.body.description;
    if(!(title && description)) {
        resp.sendStatus(400);
    }
    Projects.update({
        title: title,
        description: description
    }).then(project => {
        resp.json(project);
        resp.sendStatus(200);
    }).catch(err => {
        console.log(err);
        resp.sendStatus(500);
    })
});