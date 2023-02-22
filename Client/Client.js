const socket = io();
const app = vue.createApp({
    data() {
        return {
            message: '',
            messages: [],
            typing: false,
            user: '',
            users: [],
            connections: 0,
        }
    },
    methods: {
        // Function to send a message to the server
        SendMessage() {
            if (this.message != '') {
                socket.emit('message', this.message);
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
    },
    mounted() {
        // Function to handle the message event
        socket.on('message', (msg) => {
            this.messages.push(msg);
            console.log(msg);
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