const { PrivateKey, Show } = require("./Config")
const Color = require("colorette")
const Readline = require("readline-sync")

module.exports = {
    PrivateKey: PrivateKey,
    Readline: Readline,
    Color: Color,
    Logs: Show,
    
    Wait: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    },


    Input: (Message, Expected, Min, Max) => {
        while (true) {
            let Response = Readline.question(Message).trim()
    
            if (Expected == "number"){
                const Type = parseFloat(Response)
    
                if (!Max) {
                    Max = Min
                }
    
                if (Min) {
    
                    if (Response >= Min && Response <= Max) {
                        return Response
                    }
    
                } else {
                    if (!isNaN(Type)){
                        return Response
                    }
                }
            }
             
            console.clear()
            console.log(Color.red(`Try again (type: ${Expected}).`))
        }
    },

    CreateWarn: (ColorF, Message) => {
        console.log(ColorF(Message))
    }
}