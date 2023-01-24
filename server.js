const express = require('express');
const app = express();
const path = require('path');
const os = require('os');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        console.log(os.tmpdir());
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
})
const upload = multer({storage: storage});
const {readFileSync, rmSync} = require('fs');
const { spawn } = require('child_process');
const process = require('process');

const PYTHON_COMMAND = process.env.PYTHON_COMMAND || path.join(__dirname, "env/bin/python");

app.use(express.static('./build'))

app.get("/types", (req, res) => {
    let nerTypes = ["ORG", "LOC", "PES", "DAT"];
    let patterns = readFileSync('patterns.csv').toString().split("\n").slice(1);
    for( let linePattern of patterns ){
        let label = linePattern.split("\t")[1]
        if( nerTypes.indexOf(label) == -1 ){
            nerTypes.push(label);
        }
    }
	return res.json(nerTypes);
})

app.get("*", (req, res) => {
    res.sendFile('index.html', {root:path.join(__dirname,'build')});
})

app.post("/", upload.single('file'), (req, res) => {
    let subproc = spawn(PYTHON_COMMAND,["black-box-cli.py", req.file.path], {...process.env, PYTHONIOENCODING: 'utf-8', PYTHONLEGACYWINDOWSSTDIO: 'utf-8' }) // envs might not be needed outside windows world
    subproc.on("error", (err) => {
        console.log(err);
        res.status(500).write(err.toString());
        res.end();
    })
    subproc.stdout.pipe(res);
    subproc.stderr.on('data', (err) => {
        process.stderr.write(`ERROR: spawn: ${PYTHON_COMMAND} black-box-cli.py ${req.file.path}: ${err.toString()}`)
    });
    subproc.on('close', (code) => {
        console.log("spawn: Exited with",code)
        rmSync(req.file.path);
    })
})

app.post("/html", upload.single('file'), (req, res) => {
    let subproc = spawn(PYTHON_COMMAND,["black-box-cli.py", req.file.path,"--html-only"], {...process.env, PYTHONIOENCODING: 'utf-8', PYTHONLEGACYWINDOWSSTDIO: 'utf-8' })
    subproc.on("error", (err) => {
        console.log(err);
        res.status(500).write(err.toString());
        res.end();
    })
    subproc.stdout.pipe(res);
    subproc.stderr.on('data', (err) => {
        process.stderr.write(`ERROR: spawn: ${PYTHON_COMMAND} black-box-cli.py ${req.file.path}: ${err.toString()}`)
    });
    subproc.on('close', (code) => {
        console.log("spawn: Exited with",code)
        rmSync(req.file.path);
    })
})

app.listen(7999);