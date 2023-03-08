module.exports = {
  validator: async function (email) {
    const user = await this.constructor.findOne({ email });
    if (user) {
      if (this.id === user.id) {
        return true;
      }
      return false;
    }
    return true;
  },
  message: (props) => 'The specified email address is already in use.',
};
