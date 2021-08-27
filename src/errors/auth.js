const Errors = {
    AUR_01: 'Token is invalid',
    AUR_02: 'Email is not verified',
    AUR_03: 'Invalid login details',
    AUR_04: 'Access denied',
    AUR_05: 'Token has expired. Please login to get a new token',
    AUR_06: 'email/password',
    AUR_07: 'Access only for super admins',
    AUR_08: 'All fields are required',
    AUR_09: 'Email already exists',
    AUR_10: 'Email does not exists'
};

handleAuthErrors = (code, status, field) => {
    return {
      status,
      field,
      code: code,
      message: Errors[code],
    };
  };
  
module.exports = handleAuthErrors;