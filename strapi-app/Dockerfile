FROM prawee/strapi:latest

USER root
RUN yarn add @strapi/provider-email-nodemailer@4.16.2
COPY config/plugins.js /opt/app/config/plugins.js
COPY src/index.js /opt/app/src/index.js
RUN chown -R node:node /opt/app /opt/node_modules

USER node
EXPOSE 1337
CMD ["yarn", "start"]