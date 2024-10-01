const lib = require("../lib");
const { exec } = require("child_process");

lib.bot(
    {
        pattern: "linux ?(.*)",
        fromMe: true,
        desc: "get linux machine",
        type: "machine"
    },
    async (message, command = "ls") => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return message.send(`Error: ${error.message}`);
            }

            if (stderr) {
                return message.send(`Error: ${stderr}`);
            }

            return message.send(`Output: ${stdout}`);
        });
    }
);