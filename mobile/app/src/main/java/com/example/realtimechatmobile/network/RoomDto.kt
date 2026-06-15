package com.example.realtimechatmobile.network

data class RoomDto(
    val id: Int,
    val externalId: String,
    val title: String,
    val type: String,
    val imageUrl: String?
)