package com.example.realtimechatmobile.network

data class LoginResponse(
    val access_token: String,
    val user: UserDto
)

data class UserDto(
    val id: Int,
    val username: String,
    val email: String
)