package com.example.realtimechatmobile.network

import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET

interface ApiService {
    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse
    @GET("games/popular")
    suspend fun getPopularGames(): GamesResponse
    @POST("rooms")
    suspend fun createRoom(
        @Body request: CreateRoomRequest
    ): RoomDto
}