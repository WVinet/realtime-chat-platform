package com.example.realtimechatmobile.socket

import io.socket.client.IO
import io.socket.client.Socket

object SocketManager {

    private val socket: Socket =
        IO.socket("http://10.0.2.2:3000")

    fun connect() {
        socket.connect()
    }

    fun disconnect() {
        socket.disconnect()
    }

    fun getSocket(): Socket {
        return socket
    }
}