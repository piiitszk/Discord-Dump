const { PrivateKey, Color } = require("./utils/Utils")
const { FetchServer, CopyServer, SetApplication } = require("./utils/Copy")
const { Client, Constants } = require("discord.js-selfbot-v13")

const App = new Client({
    checkUpdate: false,
})

SetApplication(App)

console.clear()

App.on(Constants.Events.CLIENT_READY, () => {
    FetchServer()
    CopyServer()
})

console.log(Color.blueBright("[+] Establishing connection with Discord..."))
App.login(PrivateKey)