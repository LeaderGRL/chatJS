const socket = io();
const app = Vue.createApp({
    data() {
        return {
            message: 'default',
            messages: [],
            typing: false,
            user: '',
            users: [],
            connections: 0,
        }
    },
    watch: {
        username() {
            console.log("new username : ${username}")
        },
    },
    methods: {
        // Function to send a message to the server
        SendMessage() {
            this.user = username.value;
            this.message = message.value;
            console.log("LE MESSAGE : " + this.user + " : " + this.message);
            if (this.message != '') {
                socket.emit('message', 
                {
                    message: this.message,
                    name: this.user,
                });
                this.message = '';
            }
        },
        // Function to send a typing event to the server
        Typing() {
            socket.emit('Typing', this.user);
        },
        // Function to send a stop typing event to the server
        StopTyping() {
            socket.emit('StopTyping', this.user);
        },
        // Function to send a joined event to the server
        Joined() {
            if (this.user != '') {
                socket.emit('Joined', this.user);
            }
        },
        // Function to send a left event to the server
        Left() {
            if (this.user != '') {
                socket.emit('Left', this.user);
            }
        },
        Test() {
            console.log("test");
        }
    },
    mounted() {
        // Function to handle the message event
        socket.on('message', (data) => {
            this.messages.push({
                message: data.message,
                //type: 1,
                user: data.username,

            });
            console.log("testtttttttt :" + msg);
        });
        // Function to handle the typing event
        socket.on('Typing', (data) => {
            this.typing = true;
        });
        // Function to handle the stop typing event
        socket.on('StopTyping', (data) => {
            this.typing = false;
        });
        // Function to handle the joined event
        socket.on('Joined', (data) => {
            this.users.push(data);
        });
        // Function to handle the left event
        socket.on('Left', (data) => {
            this.users.splice(this.users.indexOf(data), 1);
        });
        // Function to handle the connections event
        socket.on('connections', (data) => {
            this.connections = data;
        });
    }
});

app.mount('#app')

// app.component('chat', {
//     template: `
//         <div class="chat">
//             <div class="chat-header">
//                 <h1>Chat</h1>
//             </div>
//             <div class="chat-body">
//                 <div class="chat-messages">
//                     <div class="chat-message" v-for="message in messages"> {{ message }} </div>
//                 </div>
//             </div>
//             <div class="chat-footer">
//                 <input type="text" v-model="message" @keyup.enter="SendMessage" @keyup="Typing" @keyup="StopTyping" placeholder="Type a message...">
//                 <button @click="SendMessage">Send</button>
//             </div>
//         </div>
//     `,
//     props: ['messages', 'message'],
//     methods: {
//         SendMessage() {
//             this.$emit('send-message');
//         }
//     }
// });

