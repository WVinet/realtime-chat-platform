package com.example.realtimechatmobile.network

data class GamesResponse(
    val results: List<GameDto>
)

data class GameDto(
    val id: Int,
    val name: String,
    val background_image: String?,
    val rating: Double?
)