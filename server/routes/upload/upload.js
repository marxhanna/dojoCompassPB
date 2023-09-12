const router = require('express').Router();
const { errHandling } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserByName } = require('../../service/service');
const app = express();
const path = require("path");
const fileUpload = require("express-fileupload");

const filesPayloadExists = require('../../middleware/filePayloadExists');
const fileExtLimiter = require('../../middleware/fileExtLimiter');
const fileSizeLimiter = require('../../middleware/fileSizeLimiter');

router.use(cookieParser());

app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "upload.ejs"))
});

app.post('/upload',
fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,

(req, res) => {
    const files = req.files;

    Object.keys(files).forEach(key => {
        const filepath = path.join(__dirname, 'files', files[key].name)
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err })
        })
    })

    return res.json({ status: 'success', message: Object.keys(files).toString() });
})

app.set('view engine', 'ejs');

