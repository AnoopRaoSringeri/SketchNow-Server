const cookieConfig = {
  httpOnly: true,
  expires: new Date(Date.now() + 60 * 1000 * 60 * 100000),
};

export default cookieConfig;
