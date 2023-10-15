const firstRegisterMessage = require("../messages/RegisterMessages/01");
const secondRegisterMessage = require("../messages/RegisterMessages/02");
const thirdRegisterMessage = require("../messages/RegisterMessages/03");
const fourthRegisterMessage = require("../messages/RegisterMessages/04");
const firstUploadWarrancyMessage = require("../messages/UploadWarrancies/01");
const secondUploadWarrancyMessage = require("../messages/UploadWarrancies/02");
const admin = require("firebase-admin");
const fs = require("fs");

class User {
  constructor(
    telefone = "",
    nome = "",
    cnpj = "",
    cpf = "",
    warrancies = [],
    chatLevel = 0
  ) {
    this.telefone = telefone;
    this.nome = nome;
    this.cnpj = cnpj;
    this.cpf = cpf;
    this.warrancies = warrancies;
    this.chatLevel = chatLevel;
    this.warrancyToPush = { imagem_1: "", imagem_2: "" };
    this.isLoading = false;
  }

  async updateUser(message) {
    this.isLoading = true;
    await admin
      .firestore()
      .collection("Users")
      .doc(message.from)
      .set(this.getUser());
    this.isLoading = false;
  }

  async uploadMessageToFirebase(message) {
    const messageImage = await message.downloadMedia();
    const imgName = Math.floor(Math.random() * Date.now());
    this.isLoading = true;

    fs.writeFileSync(
      `./upload/${imgName}.jpeg`,
      Buffer.from(messageImage.data, "base64").toString("binary"),
      "binary"
    );

    await admin.storage().bucket().upload(`./upload/${imgName}.jpeg`);

    fs.unlink(`./upload/${imgName}.jpeg`, (err) => {
      console.log(err);
    });

    const url = await admin
      .storage()
      .bucket()
      .file(`${imgName}.jpeg`)
      .getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
    this.isLoading = false;

    return url[0];
  }

  async addUserToDatabase(message) {
    this.isLoading = true;

    await admin
      .firestore()
      .collection("Users")
      .doc(message.from)
      .set(this.getUser());

    this.isLoading = false;
  }

  async sendMessage(message, content) {
    switch (this.chatLevel) {
      case 0:
        this.telefone = message.from;
        firstRegisterMessage(message);
        this.chatLevel = 1;
        break;
      case 1:
        this.nome = content;
        secondRegisterMessage(message);
        this.chatLevel = 2;
        break;
      case 2:
        this.cnpj = content;
        thirdRegisterMessage(message);
        this.chatLevel = 3;
        break;
      case 3:
        this.cpf = content;
        fourthRegisterMessage(message);
        await this.addUserToDatabase(message);
        message.reply(
          "*CADASTRO REALIZADO COM SUCESSO*\n\nRecebemos seu cadastro. A partir de agora, sempre que quiser enviar um certificado, digite *ENVIAR*"
        );
        this.chatLevel = 4;
        break;
      case 4:
        if (message.body.toLowerCase() !== "enviar") {
          message.reply("Digite *ENVIAR* para mandar um certificado");
          break;
        }
        firstUploadWarrancyMessage(message);
        this.chatLevel = 5;
        break;
      case 5:
        if (!message.hasMedia) break;
        secondUploadWarrancyMessage(message);
        const url = await this.uploadMessageToFirebase(message);

        this.warrancyToPush.imagem_1 = url;

        this.chatLevel = 6;
        break;
      case 6:
        if (!message.hasMedia) break;

        const url2 = await this.uploadMessageToFirebase(message);

        this.warrancyToPush.imagem_2 = url2;

        this.warrancies.push(this.warrancyToPush);

        this.warrancyToPush = { imagem_1: "", imagem_2: "" };

        await this.updateUser(message);

        message.reply(
          "*RECEBIDO*\n\nSeu certificado foi recebido e está passando por análise.\nLembre-se, sempre que quiser enviar um certificado, digite *ENVIAR*"
        );

        this.chatLevel = 4;
        break;
    }
  }

  getUser() {
    return {
      nome: this.nome,
      telefone: this.telefone,
      cnpj: this.cnpj,
      cpf: this.cpf,
      warrancies: this.warrancies,
    };
  }
}

module.exports = User;
