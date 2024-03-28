const { boot } = require("quasar/wrappers");
const VuePlugin = require("@quasar/quasar-ui-qcalendar");

module.exports = boot(({ app }) => {
  app.use(VuePlugin);
});
