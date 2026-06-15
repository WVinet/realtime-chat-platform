package com.example.realtimechatmobile.network

data class CreateRoomRequest(
    val externalId: String,
    val title: String,
    val type: String = "GAME",
    val imageUrl: String?
)