import { net, protocol } from "electron";
import url from 'node:url'
import path from 'node:path'

export let setupProtocol = () => {
    protocol.handle('mediafile', (request) => {
        let extensions = ['.mp3', '.wav', '.ogg']
        const filePath = request.url.slice('mediafile://'.length)
        const urlStr = `file:///${filePath}`
        console.log(urlStr)
        const ext = path.extname(urlStr).toLowerCase();
        if (!extensions.includes(ext)) {
            return new Response('bad', {
                status: 404,
                headers: { 'content-type': 'audio/*' }
            })
        }
        return net.fetch(urlStr)
    })
}

export let registerSchemes = () => {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'mediafile',
        privileges: {
            secure: true,
            supportFetchAPI: true,
            bypassCSP: true,
            stream: true,
            standard: true,
        }
      }
    ])
}