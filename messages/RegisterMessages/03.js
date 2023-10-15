function thirdRegisterMessage(message) {
  if (
    message.body.length != 14 ||
    message.body.includes(".") ||
    message.body.includes("/")
  ) {
    message.reply(
      "Não entendi, por favor, digite novamente seu CNPJ (Apenas números, com 14 caracteres):"
    );
    return "error";
  }

  message.reply(`Informação recebida, obrigado!

Agora digite aqui seu CPF (Não utilizaremos para outra finalidade a não ser evitar duplicidade de cadastros)`);

  return message.body;
}

module.exports = thirdRegisterMessage;
