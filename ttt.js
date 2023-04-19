
window.onload = function (e){

    console.log("CONNECTING TO FIREBASE")
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyDoX5m-JFKQP4vKT6LVpMJNQDqriBHjHIA",
        authDomain: "tictactoe-6fdd3.firebaseapp.com",
        projectId: "tictactoe-6fdd3",
        storageBucket: "tictactoe-6fdd3.appspot.com",
        messagingSenderId: "1033917000893",
        appId: "1:1033917000893:web:80661e1890cc5168651bd4",
        measurementId: "G-W5V27CTK0W"
    };

    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Init!")
    } catch (err) {
        console.warn("Can't Connect to Firebase")
    }

    
    let boardState = {
        "player": "X",
        "board": [["", "", ""],
                  ["", "", ""],
                  ["", "", ""]],
        "playerNumber" : 1,
        "winner": null,
        "full": false,
        "player1": null,
    }
    

    let stringBoard = JSON.stringify(boardState)
    console.log("Boardstate:", boardState)
    console.log(stringBoard)
    localStorage.setItem("boardState", stringBoard)

    const db = firebase.database()
    
    const boardRef = db.ref("boardState")
    boardRef.set(boardState)

    const playerRef = db.ref("boardState/player")
    const playerNumberRef = db.ref("boardState/playerNumber")
    
    // Subscribe!
    boardRef.on("value", (snapshot)=>{
        console.log(snapshot)
        let val = snapshot.val()
        console.log("player:", val)
    })
    test = null
    console.log()
    
    
    new Vue({
        el: '#ttt',
    
        template:
            `
            <div id="ttt"> 

                <div class="turn" >
                    <div>Player {{this.boardState.player}}'s Turn</div>
                </div>
                <div class="board">
                    <div v-for="(row, rowIndex) in boardState.board" :key="rowIndex" class="row">
                        <div
                            v-for="(cell, cellIndex) in row"
                            :key="cellIndex"
                            class="cell"
                            @click="handleClick(rowIndex, cellIndex)"
                        >
                        {{cell}}
                        
                        </div>
                    </div>
                </div>
                <div class="winner" v-if="winning">
                    The Winner Is {{boardState.winner}}
                </div>
                <button class="restart" v-if="winning" @click="restart()">RESTART GAME</button>
            </div>
            
            
            `,
        
    
        data: {
            boardState: boardState,
            playerType: null
        },

        methods: {
            handleClick(row, col){
                if (!this.boardState.winner && this.boardState.board[row][col] === "") {
                    //I wasn't able to get the board to change so I asked gpt how to put the correct
                    //player's value here and update what the board looked like
                    this.$set(this.boardState.board[row], col, this.boardState.player);
                    this.checkForWinner()
                    boardRef.set(this.boardState);
                    this.boardState.player = this.boardState.player === "X" ? "O" : "X";
                  }
            },

            checkForWinner() {
                for (let row=0; row < 3; row++){
                    for (let col = 0; col<3; col++){
                        if (this.boardState.board[row][col] === ""){
                            this.boardState.full = false 
                            break
                        }
                        this.boardState.full = true
                    }
                }


                // Check rows for a win
                for (let row = 0; row < 3; row++) {
                  if (this.boardState.board[row][0] === this.boardState.board[row][1] && this.boardState.board[row][1] === this.boardState.board[row][2]) {
                    return this.boardState.winner = this.boardState.board[row][0];
                  }
                }
              
                // Check columns for a win
                for (let col = 0; col < 3; col++) {
                  if (this.boardState.board[0][col] === this.boardState.board[1][col] && this.boardState.board[1][col] === this.boardState.board[2][col]) {
                    return this.boardState.winner = this.boardState.board[0][col];
                  }
                }
              
                // Check diagonals for a win
                if (this.boardState.board[0][0] === this.boardState.board[1][1] && this.boardState.board[1][1] === this.boardState.board[2][2]) {
                  return this.boardState.winner = this.boardState.board[0][0];
                }
                if (this.boardState.board[0][2] === this.boardState.board[1][1] && this.boardState.board[1][1] === this.boardState.board[2][0]) {
                  return this.boardState.winner = this.boardState.board[0][2];
                }
              
                // If there are no winners, return null
                if (this.boardState.full){
                    return this.boardState.winner = "Nobody 😫";
                }
                
              },
            
            restart(){
              
              this.boardState.board =[["", "", ""],
                  ["", "", ""],
                  ["", "", ""]]
              this.boardState.player = "X"
              this.boardState.winner = null
              boardRef.set(this.boardState)
            }
        },
        

        watch: {
            "boardState.player"(){
                console.log("New user:", this.boardState.player)
                playerRef.set(this.boardState.player)
            }

        },

        computed: {
            winning(){
              return this.boardState.winner == "X" || this.boardState.winner == "O" ||this.boardState.winner == "Nobody 😫"
                
            }
        },

        mounted(){
            
            boardRef.on("value", (snapshot)=>{
                let board = snapshot.val()
                this.boardState = board
            })
            
            
            
        }
    
    
    })
}
