import { rest } from 'msw'

export const handlers = [
    rest.post('http://localhost:8000/login/', (req, res, ctx) => {
        const { username, password} = req.body
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

    })
]