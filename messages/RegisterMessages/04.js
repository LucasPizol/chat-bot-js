function fourthRegisterMessage(message) {
  if (
    message.body.length != 11 ||
    message.body.includes(".") ||
    message.body.includes("/")
  ) {
    message.reply(
      "Não entendi, por favor, digite novamente seu CPF (Apenas números, com 11 caracteres):"
    );
    return "error";
  }

  message.reply("Aguarde... Estamos processando seu cadastro...");

  return message.body;
}

module.exports = fourthRegisterMessage;
