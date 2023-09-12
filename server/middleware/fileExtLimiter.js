const path = require("path")

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files

        const fileExtensions = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        // Arquivos permitidos 
        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))

        if (!allowed) {
            const message = `Upload falhou. Apenas ${allowedExtArray.toString()} arquivos são permitidos.`.replaceAll(",", ", ");

            return res.status(422).json({ status: "error", message });
        }

        next()
    }
}

module.exports = fileExtLimiter