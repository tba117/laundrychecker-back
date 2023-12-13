const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const USER = process.env.USER;
const PASS = process.env.PASS;

const app = express();
app.use(express.json());  //.jsonの受け取り
app.use(cors());


// フォームのデータを受け取るエンドポイント
app.post('/send-email', async (req,res) => {
    const { email, name, message } = req.body; // フォームからのデータ


    // メール送信の設定
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: USER,   // 送信元のGmailアドレス
            pass: PASS  // 送信元のGmailアカウントの'アプリ'パスワード(二段階認証必須)
        },
    });

    // メールの内容
    const mailOptions = {
        from: USER,
        to: email,
        subject: '[洗濯表示チェッカー] お問い合わせを受け付けました',
        text: name + '様\n\nお問い合わせいただきありがとうございます。\n以下の内容でお問い合わせを受け付けました。\n\n【お名前(ニックネーム可)】\n' + name + '\n【メールアドレス】\n' + email + '\n【お問い合わせ・ご意見・ご感想】\n' + message + '\n\n※このメールに心あたりがない場合には、下記のページよりお問い合わせください。\nhttp://localhost:3000/mail\n\n本フォームにて送信いただいたお問合せについては、原則３日以内にご返信差し上げます。４日以上経過しても返信がない場合には、大変お手数ですが再度フォームからご連絡いただけますと幸いです。'
    };

    //非同期処理の中での処理
    try{
        // メールを送信
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch(error){
        res.status(500).send('Error sending email.');
    }
});



//CORSのエラー対策 Headerの設定
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://www.laundrychecker.com/");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTION"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });



// サーバーを起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server is running on 3001');
});