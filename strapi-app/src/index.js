'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    const resetUrl = process.env.RESET_PASSWORD_URL;
    if (resetUrl) {
      const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
      const advanced = (await store.get({ key: 'advanced' })) || {};
      advanced.email_reset_password = resetUrl;
      await store.set({ key: 'advanced', value: advanced });
    }
  },
};