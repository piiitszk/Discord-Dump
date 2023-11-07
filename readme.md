# Discord Server Dumper

A tool to copy and recreate a Discord server

## Attention

The excessive use of the tool may result in suspicious activity, leading to the need for a password change (Discord's own security).

The tool and its creator are not responsible for improper use.

## USAGE

* [Clone or download the repository](https://github.com/piiitszk/Discord-Dump) into a folder.
* [Log in to your Discord account](https://discord.com) through the website.
* Open the Dev Tools (CTRL + SHIFT + I) and go to the "console" category.
* Copy and paste the code next to it
* Get your token and place it in utils/Config.json, under "Private Key."
* Open the command prompt (cmd) inside the folder.
* Type "npm install" and then "node ."
* Copy the server ID you want to copy and paste it.

<details>
<summary>Clique para mostrar o código</summary>

```javascript
(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
```
</details>

## FAQ

#### Is it possible to copy messages?

No. Discord doesn't allow reading of private channels.

#### Can private channels be copied?

Yes. All private channels will be copied.

#### Why are only categories, text, and voice channels copied?

Currently, I prefer to copy only these three types, but in the future, who knows, I might make it compatible with other channel types.

#### How can I suggest an update?

You can suggest an update or software on my Discord, just add "piitszk".