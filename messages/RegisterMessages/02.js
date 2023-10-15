function secondRegisterMessage(message) {
  message.reply(
    `Ok, ${message.body}, agora digite aqui seu CNPJ (SOMENTE NÚMEROS):`
  );
}

module.exports = secondRegisterMessage;
