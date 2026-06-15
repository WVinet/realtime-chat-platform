package com.example.realtimechatmobile

import android.app.Activity
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.realtimechatmobile.network.LoginRequest
import com.example.realtimechatmobile.network.RetrofitClient
import kotlinx.coroutines.launch
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import com.example.realtimechatmobile.network.GameDto
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.platform.LocalContext
import com.example.realtimechatmobile.network.ChatMessage
import com.example.realtimechatmobile.network.CreateRoomRequest
import org.json.JSONObject
import com.example.realtimechatmobile.socket.SocketManager



class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            App()
        }
    }
}
@Composable
fun App() {

    var loggedIn by remember {
        mutableStateOf(false)
    }

    var selectedRoomId by remember {
        mutableStateOf<Int?>(null)
    }

    when {

        !loggedIn -> {
            LoginScreen {
                loggedIn = true
            }
        }

        selectedRoomId == null -> {
            RoomsScreen(
                onRoomSelected = { roomId ->
                    selectedRoomId = roomId
                }
            )
        }

        else -> {
            ChatScreen(
                roomId = selectedRoomId!!
            )
        }
    }
}


data class UiGame(
    val id: Int,
    val name: String
)

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit
) {

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {

        Text(
            text = "GameHub Login",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Correo") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Contraseña") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {

                scope.launch {

                    try {

                        val response =
                            RetrofitClient.api.login(
                                LoginRequest(
                                    email,
                                    password
                                )
                            )

                        println(response)

                        onLoginSuccess()

                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Ingresar")
        }
    }


}

@Composable
fun RoomsScreen(
    onRoomSelected: (Int) -> Unit) {

    var games by remember {
        mutableStateOf<List<GameDto>>(emptyList())
    }

    val scope =
        rememberCoroutineScope()

    LaunchedEffect(Unit) {

        try {

            games =
                RetrofitClient.api
                    .getPopularGames()
                    .results

        } catch (e: Exception) {

            e.printStackTrace()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        Text(
            text = "Juegos populares",
            style =
                MaterialTheme
                    .typography
                    .headlineMedium
        )

        Spacer(
            modifier =
                Modifier.height(16.dp)
        )

        LazyColumn {

            items(games) { game ->

                Card(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                            .clickable {

                                scope.launch {

                                    try {

                                        val room =
                                            RetrofitClient.api.createRoom(
                                                CreateRoomRequest(
                                                    externalId =
                                                        game.id.toString(),
                                                    title = game.name,
                                                    imageUrl =
                                                        game.background_image
                                                )
                                            )

                                        onRoomSelected(room.id)

                                    } catch (e: Exception) {
                                        e.printStackTrace()
                                    }
                                }
                            }
                ) {

                    Column(
                        modifier =
                            Modifier.padding(16.dp)
                    ) {

                        Text(game.name)

                        Text(
                            "⭐ ${game.rating ?: 0}"
                        )
                    }
                }
            }
        }
    }
}
@Composable
fun ChatScreen(
    roomId: Int
) {
    val context = LocalContext.current

    var message by remember {
        mutableStateOf("")
    }

    var messages by remember {
        mutableStateOf<List<ChatMessage>>(emptyList())
    }

    LaunchedEffect(Unit) {

        SocketManager.connect()

        val socket =
            SocketManager.getSocket()

        val joinData =
            JSONObject()

        joinData.put(
            "roomId",
            roomId
        )

        joinData.put(
            "username",
            "androidUser"
        )

        socket.emit(
            "join_room",
            joinData
        )

        socket.on("new_message") { args ->

            try {

                val data =
                    args[0] as org.json.JSONObject

                val sender =
                    data.getJSONObject("sender")

                val username =
                    sender.getString("username")

                val content =
                    data.getString("content")

                (context as Activity).runOnUiThread {

                    messages =
                        messages + ChatMessage(
                            username,
                            content
                        )
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {

        Text(
            "Sala $roomId"
        )

        Spacer(
            modifier = Modifier.height(16.dp)
        )

        Text("Conectado al socket")

        Spacer(
            modifier = Modifier.height(16.dp)
        )

        LazyColumn(
            modifier = Modifier.weight(1f)
        ) {

            items(messages) { msg ->

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {

                    Column(
                        modifier = Modifier.padding(12.dp)
                    ) {

                        Text(
                            text = msg.username
                        )

                        Text(
                            text = msg.content
                        )
                    }
                }
            }
        }


        OutlinedTextField(
            value = message,
            onValueChange = {
                message = it
            },
            label = {
                Text("Mensaje")
            },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(
            modifier = Modifier.height(12.dp)
        )

        Button(
            onClick = {

                val socket =
                    SocketManager.getSocket()

                val payload =
                    JSONObject()

                payload.put(
                    "roomId",
                    roomId
                )

                payload.put(
                    "message",
                    message
                )

                payload.put(
                    "senderId",
                    2
                )

                socket.emit(
                    "send_message",
                    payload
                )

                message = ""
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Enviar")
        }
    }
}