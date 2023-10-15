const qrcode = require("qrcode-terminal");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { Client } = require("whatsapp-web.js");
const User = require("./classes/User");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "projeto-moura-2.appspot.com",
});

async function getUsers() {
  const response = await admin.firestore().collection("Users").get();
  const data = response.docs.map((doc) => doc.data());
  return data;
}

const users = [];

getUsers().then((response) => {
  response.map((user) => {
    users.push(
      new User(
        user.telefone,
        user.nome,
        user.cnpj,
        user.cpf,
        user.warrancies,
        4
      )
    );
  });
});

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", async (message) => {
  if (message.from != "553588766938@c.us") return;

  const findUser = users.find((user) => user.telefone === message.from);

  if (!findUser) {
    const user = new User();
    users.push(user);
    user.sendMessage(message, message.body);
    return;
  }

  if (findUser.isLoading) {
    message.reply("Por favor, aguarde.");
    return;
  }

  findUser.sendMessage(message, message.body);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();
