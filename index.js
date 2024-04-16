const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://{0}:{1}@cluster0.i2ylb5e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.set('view engine', 'ejs')

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri.format(process.env.MONGODB_ID, process.env.MONGODB_PW), {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db
client.connect().then((client) => {
    console.log('DB연결성공')
    db = client.db('forum')

    app.listen(8080, () => {
        console.log('http://localhost:8080 에서 서버 실행중')
    })
}).catch((err) => {
    console.log(err)
})

app.use(express.static(__dirname + '/public'));

app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/list', async (요청, 응답) => {
    let result = await db.collection('post').find().toArray()
    응답.render('list.ejs', { 글목록: result })
})