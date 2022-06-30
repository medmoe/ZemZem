import {DefaultBodyType, rest} from 'msw'

type CustomizedBodyType = DefaultBodyType & {
    first_name?:string,
    last_name?:string,
    email?:string,
    username?: string,
    password?: string,
}

export const handlers = [
    rest.post('http://localhost:8000/login/', (req, res, ctx) => {

        const { username, password } = req.body as CustomizedBodyType
        if(username === 'username' && password === 'password'){
            return res(
                ctx.status(200),
                ctx.json({
                    'username': username,
                    'password': password,
                })
            )
        }else {
            return res(
                ctx.status(401),
                ctx.json({
                    'Message': 'some error message',
                })
            )
        }
    }),
    rest.get('http://localhost:8000/home/', (req, res, ctx) => {
        const token = 'undefined';
        if (token) {
            return res(
                ctx.status(200),
            )
        }else{
            return res(
                ctx.status(401),
            )
        }

    }),
    rest.post('http://localhost:8000/signup/', (req, res, ctx) => {
        const {first_name, last_name, email, username, password} = req.body as CustomizedBodyType
        if (username === 'username' || email === 'email@test.test'){
            return res(
                ctx.status(400),
                ctx.json({'Message': 'user with the same data already exist!'})
            )
        }else{
            return res(
                ctx.status(200),
                ctx.json({
                    'first_name':first_name,
                    'last_name':last_name,
                    'email':email,
                    'username':username,
                })
            )
        }
    }),
    rest.get('http://localhost:8000/logout/', (req, res, ctx) => {
        return res(
            ctx.status(200),
        )
    })
]