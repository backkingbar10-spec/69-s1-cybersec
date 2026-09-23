module.exports = ({ env }) => {
  const providerOptions = {
    host: env("SMTP_HOST", "mailpit"),
    port: env.int("SMTP_PORT", 1025),
    secure: env.bool("SMTP_SECURE", false),
  };

  if (env("SMTP_USERNAME")) {
    providerOptions.auth = {
      user: env("SMTP_USERNAME"),
      pass: env("SMTP_PASSWORD"),
    };
  }

  return {
    email: {
      config: {
        provider: "nodemailer",
        providerOptions,
        settings: {
          defaultFrom: env("SMTP_FROM", "no-reply@localhost"),
          defaultReplyTo: env("SMTP_FROM", "no-reply@localhost"),
        },
      },
    },
  };
};