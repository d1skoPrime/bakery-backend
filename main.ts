require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "https://zinasbakery.vercel.app", // Разрешить запросы только с этого домена
    methods: ["GET", "POST"], // Разрешить только нужные методы
    allowedHeaders: ["Content-Type, *"], // Разрешить нужные заголовки
  })
);

app.use(express.json());
app.get("/api/hello", (req:any, res:any) => {
  res.json({ message: "Hello from API!" });
});
app.post("/send-email", async (req:any, res:any) => {
  const { firstName, lastName, email, message, phonenumber, productname } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Твой email
      pass: process.env.EMAIL_PASS, // Пароль или App Password
    },
  });
	const emailContent = `
    <h1>Новый Заказ От ${firstName} ${lastName}</h1>
    <p><strong>Полное Имя Клиента:</strong> ${firstName} ${lastName}</p>
    <p><strong>Почта Клиента:</strong> ${email}</p>
    <p><strong>Номер Телефона Клиента: ${phonenumber}</p>
    <p><strong>Название Продукта:</strong> ${productname}</p>
    <p><strong>Доп.Сообщение от клиента:</strong></p>
    <p>${message}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Самому себе
    subject: `Новый заказ от ${firstName}`,
    html:emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
