import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

const SECRET_KEY = '1f834bff127623b38d6751e1628cb2f0cdb5084b2bd7d84f1b6fb48dd3d4950e6c0b40c0dfd3a7509b3e6ac00198b3562bb4c6376a3b9ebb532a80eacfdfd02a2d8bb6dda8add2d821a48a517851388c02f663673b9e3b7f4a2a0e74bd7b40f0105c7d6faa371d32f67a4a06af75fe9ef59388eab3c0d7eab49d118d85ee1a0ad51d579cac282fd765782596853d4f22be5704befa58828e5d04996738e4a44a84bd1d6d2aba25997aa5b602b980219cc6a461e446aa654ccae6b129a9f47415794a03785f1f856f2d57c4282ef74bf0cf04cc17f6586817ef37feb34e3529b495125ea20cdeff469e23bea7d8b7055a6144bdb10c4f3a9efed573ac6dd9a0ed'; // Secret key for signing JWT
const tokenExpiresIn = 15 * 60;// 15 * 60 segundos = 15 minutos
const refreshTokenExpiresIn = '24h'; // 24 horas

const authenticateJWTMiddleware = function (req, res, next) {
    if (req.cookies.token) {
        try {
            const decodedToken = verify(req.cookies.token, SECRET_KEY);            
            req.auth = {"userId" : decodedToken.userId};
            next();
            return;
        } catch (error) {
            return res.status(401).send('Token expired or invalid.');
        }
    }
    return res.status(401).send('Request missing Authorization Data.');
}

function generateTokenPair(res, userId) {
    const token = sign({ userId: userId }, SECRET_KEY, { expiresIn: tokenExpiresIn });
    const refreshToken = sign({ userId: userId }, SECRET_KEY, { expiresIn: refreshTokenExpiresIn });
    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'None'}); //Set secure: true if https
    res.cookie('refreshtoken', refreshToken, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'None', path: "/refresh" }); //Set secure: true if https
    return res.json({ "userId": userId });
}

export function enableJWTAuthenticationMiddleware({ app, validateUserFunction}) {
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        const userId = await validateUserFunction(username, password);
        if (userId <= 0) {
            return res.status(401).send('Invalid credentials.');
        }

        return generateTokenPair(res, userId);
    });

    app.post('/refresh', (req, res) => {
        if (req.cookies.refreshtoken) {
            try {
                const decodedRefreshToken = verify(req.cookies.refreshtoken, SECRET_KEY);
                return generateTokenPair(res, decodedRefreshToken.userId);
            } catch (error) {
                return res.status(401).send('Refresh Token expired or invalid.');
            }
        }
        return res.status(401).send('Request missing Authorization Data.');
    });

    app.use(authenticateJWTMiddleware);
}
