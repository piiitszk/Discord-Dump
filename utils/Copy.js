const { Client } = require("discord.js-selfbot-v13")
const { Input, Color, CreateWarn, Wait, Logs } = require("./Utils")

let App = null
let Target = null

const ChannelType = ["GUILD_TEXT", "GUILD_VOICE", "GUILD_CATEGORY"]

function SetApplication(Base) {
    if (!(Base instanceof Client)) {
        throw new Error("Invalid application")
    } 

    App = Base
}

function CopyChannelOptions(Channel, Parent) {
    if (!ChannelType.includes(Channel.type)) {
        return false
    } 

    const BaseOption = {
        type: Channel.type,
        topic: Channel.topic,
        nsfw: Channel.nsfw,
        bitrate: Channel.bitrate > 96000 ? 96000 : Channel.bitrate,
        userLimit: Channel.userLimit,
        position: Channel.position,
        rateLimitPerUser: Channel.rateLimitPerUser,
        rtcRegion: Channel.rtcRegion,
        videoQualityMode: Channel.videoQualityMode,
        reason: "piitszk servers copy"
    }

    if (Channel.parentId) {
        BaseOption["parent"] = Parent
    }

    return BaseOption
}

function CopyRoleOptions(Role) {
    return {
        name: Role.name,
        color: Role.color,
        position: Role.position,
        icon: Role.icon,
        mentionable: Role.mentionable,
        managed: Role.managed,
        permissions: Role.permissions,
        reason: "piitszk servers copy"
    }
}

function FetchServer(){
    while (true) {
        const Attempt = Input(Color.blueBright("-> Server ID: "), "number")
        let Sucess = false 

        for (const Guild of App.guilds.cache.values()) {
            if (Guild.id == Attempt) {
                Target = Guild
                Sucess = true
                break
            }
        }

        if (Sucess){ 
            break
        }

        console.clear()
        CreateWarn(Color.red, "[-] This server doesn't exists")
    }
}

function CopyServer() {
    console.clear()

    const Took = Date.now()

    const ServerOptions = {
        icon: Target.iconURL()
    }

    CreateWarn(Color.greenBright, "[+] Generating server (1/6)...")

    App.guilds.create(Target.name, ServerOptions).then(async (Dump) => {
        CreateWarn(Color.greenBright, "[+] Deleting default channels (2/6)...")

        Dump.channels.cache.forEach((Channel) => { Channel.delete() })

        while (Dump.channels.cache.size > 0) {
            await Wait(5)
        }

        CreateWarn(Color.greenBright,"[+] Fetching channels (3/6)...")
        CreateWarn(Color.greenBright,"[+] Fetching roles (4/6)...")

        const ChannelsCache = Target.channels.cache
        const RolesCache = Target.roles.cache

        const Categorys = ChannelsCache.filter((Channel) => Channel.type == "GUILD_CATEGORY")
        const Channels = ChannelsCache.filter((Channel) => Channel.type != "GUILD_CATEGORY")
    
        let CopyInfo = {
            Copied: 0,
            CategorysCreated: 0,
            ChannelsCreated: 0,
            RolesCreated: 0,
            Errors: 0,
            SizeRoles: RolesCache.size - 1,
            SizeChannels: Channels.size
        }

        const Parents = {}

        const CreateChannelBased = (Base) => {
            const ChannelOption = CopyChannelOptions(Base, Parents[Base.parentId])

            if (!ChannelOption) {
                if (Base.type != "GUILD_CATEGORY") {
                    CopyInfo.SizeChannels -= 1
                }


                CopyInfo.Errors += 1
                if (Logs.Error){
                    CreateWarn(Color.redBright, `[LOG] Channel ${Base.name} can't be copied 'cause it has an unsupported type (${Base.type})...`)
                }
            } else {
                try {
                    Dump.channels.create(Base.name, ChannelOption).then((Content) => {
                        if (Logs.Copy) {
                            CreateWarn(Color.yellowBright, Base.type == "GUILD_CATEGORY" ? `[LOG] Category ${Base.name} sucessfully copied` : `[LOG] Channel ${Base.name} sucessfully copied`)
                        }

                        CopyInfo.Copied += 1
                        if (Base.type == "GUILD_CATEGORY") {
                            CopyInfo.CategorysCreated += 1
                            Parents[Base.id] = Content.id
                        } else {
                            CopyInfo.ChannelsCreated += 1
                        }
                    })
                } catch {
                    CopyInfo.Errors += 1

                    if (Base.type != "GUILD_CATEGORY") {
                        CopyInfo.SizeChannels -= 1
                    }

                    if (Logs.Error){
                        CreateWarn(Color.redBright, `[LOG] Can't copy channel ${Base.name} (Discord Error)`)
                    }
                }
            }
        }


        CreateWarn(Color.greenBright, "[+] Creating channels (5/6)...")

        Categorys.forEach((Category) => {
            CreateChannelBased(Category)
        })

        while (!(CopyInfo.CategorysCreated == Categorys.size)){
            await Wait(200)
        }

        Channels.forEach((Channel) => {
            CreateChannelBased(Channel)
        })

        
        while (!(CopyInfo.ChannelsCreated == CopyInfo.SizeChannels)){
            await Wait(200)
        }

        CreateWarn(Color.greenBright, "[+] Creating Roles (6/6)...")

        RolesCache.forEach((Role) => {
            if (Role.name != "@everyone") {
                try {
                    Dump.roles.create(CopyRoleOptions(Role)).then(() => {
                        if (Logs.Copy) {
                            CreateWarn(Color.yellowBright, `[LOG] Role ${Role.name} sucessfully copied`)
                        }

                        CopyInfo.Copied += 1
                        CopyInfo.RolesCreated += 1
                    }).catch((Err) => { CopyInfo.SizeRoles -= 1 })
                } catch (Err){
                    CopyInfo.SizeRoles -= 1
                    CopyInfo.Errors += 1

                    if (Logs.Error){
                        CreateWarn(Color.redBright, `[LOG] Can't copy role ${Role.name} (Discord Error)`)
                    }
                }
            }        
        })

        while (!(CopyInfo.RolesCreated == CopyInfo.SizeRoles)){
            await Wait(200)
        }

        CreateWarn(Color.greenBright, "---------------------------------------")
        CreateWarn(Color.greenBright, "[!] Server dump sucessfully complete...")
        CreateWarn(Color.greenBright, `[!] Categorys: ${CopyInfo.CategorysCreated}`)
        CreateWarn(Color.greenBright, `[!] Channels: ${CopyInfo.ChannelsCreated}`)
        CreateWarn(Color.greenBright, `[!] Roles: ${CopyInfo.RolesCreated}`)
        CreateWarn(Color.greenBright, `[!] Took: ${(Date.now() - Took) / 1000} seconds`)
        CreateWarn(Color.greenBright, `[!] Errors: ${CopyInfo.Errors}`)
        CreateWarn(Color.greenBright, "---------------------------------------")

        CreateWarn(Color.blueBright, "[+] Your connection has been terminated.")
        process.exit()
    })
}

module.exports = {
    FetchServer: FetchServer,
    CopyServer: CopyServer,
    SetApplication: SetApplication
}