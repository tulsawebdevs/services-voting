import {TEST_USER} from "./helpers";

const admins = [
    'zenlex@zenlex.dev',
    'alec@helmturner.dev',
    'niledixon475@gmail.com',
    'cryskayecarr@gmail.com'
]

if (process.env.NODE_ENV === 'test') {
    admins.push(TEST_USER.userEmail)
}

module.exports = {
    admins
};