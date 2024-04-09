export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    // Determine the cookie name based on the user's role
    const cookieName = user.role === 'Admin' ? 'adminToken' : 'userToken';
  
    res
      .status(statusCode)
      .cookie(cookieName, token, {
        expires: new Date(
          // 7 d 
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          // from right milli second,second,minute,hr
        ),
        httpOnly: true,
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  };