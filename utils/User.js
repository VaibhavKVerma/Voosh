const ROLE = {
    admin:"admin",
    normal:"normal"
}

const allowedFields = ['email', 'password', 'username', 'bio', 'phone', 'photo_url', 'is_public', 'role'];

module.exports = {
    ROLE,
    allowedFields
}