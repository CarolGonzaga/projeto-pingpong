const canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d"),
    gapX = 10

const mouse = { x: 0, y: 0 }
const scorep1 = document.getElementById('player1'),
    scorep2 = document.getElementById('player2')


const field = {
    w: window.innerWidth,
    h: window.innerHeight - 150,
    draw: function() {
        canvasCtx.fillStyle = "#286047"
        canvasCtx.fillRect(0, 0, this.w, this.h)
        canvasCtx.lineWidth = 15;
        canvasCtx.strokeStyle = '#FFF';
        canvasCtx.strokeRect(0, 0, this.w, this.h)
    },
}

const line = {
    w: 15,
    h: field.h,
    draw: function() {
        canvasCtx.fillStyle = "#FFF"
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    },
}

const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: function() {
        if (field.h > 500) {
            return 150
        } else {
            return field.h / 3
        }
    },
    _move: function() {
        this.y = mouse.y - this.h() / 2 - 130
    },
    draw: function() {
        canvasCtx.fillStyle = "#AA1119"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h())

        this._move()
    },
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: line.w,
    h: function() {
        if (field.h > 500) {
            return 150
        } else {
            return field.h / 3
        }
    },
    speed: 5,
    _move: function() {
        if (this.y + this.h() / 2 < ball.y + ball.r()) {
            this.y += this.speed
        } else {
            this.y -= this.speed
        }
    },
    speedUp: function() {
        if (this.speed < 12) {
            this.speed += 2
        } else if (score.isLosing()) {
            this.speed += 4
        }
    },
    draw: function() {
        canvasCtx.fillStyle = "#083660"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h())
        this._move()
    },
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function() {
        this.human++
    },
    increaseComputer: function() {
        this.computer++
    },
    updateScore: function() {
        scorep1.innerText = this.human
        scorep2.innerText = this.computer
    },
    isLosing: function() {
        return this.computer - this.human >= 3
    },
    endGame: function() {
        if (this.human == 5) {
            alert("Você ganhou!");
            this.human = 0
            this.computer = 0
            location.reload();
        } else if (this.computer == 5) {
            alert("A máquina ganhou!");
            this.human = 0
            this.computer = 0
            location.reload();
        }
    }
}

const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: function() {
        if (field.h > 500) {
            return 20
        } else {
            return field.h / 30
        }
    },
    speed: 7,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        // verifica se o jogador 1 fez um ponto (x > largura do campo)
        if (this.x > field.w - this.r() - rightPaddle.w - gapX - 15) {
            // verifica se a raquete direita está na posição y da bola
            if (
                this.y + this.r() > rightPaddle.y &&
                this.y - this.r() < rightPaddle.y + rightPaddle.h()
            ) {
                // rebate a bola intervertendo o sinal de X
                this._reverseX()
            } else {
                // pontuar o jogador 1
                score.increaseHuman()
                this._pointUp()
                rightPaddle.speedUp()
            }
        }

        // verifica se o jogador 2 fez um ponto (x < 0)
        if (this.x < this.r() + leftPaddle.w + gapX + 15) {
            // verifica se a raquete esquerda está na posição y da bola
            if (
                this.y + this.r() > leftPaddle.y &&
                this.y - this.r() < leftPaddle.y + leftPaddle.h()
            ) {
                // rebate a bola intervertendo o sinal de X
                this._reverseX()
            } else {
                // pontuar o jogador 2
                score.increaseComputer()
                this._pointUp()
            }
        }

        // verifica as laterais superior e inferior do campo
        if (
            (this.y - this.r() < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r() && this.directionY > 0)
        ) {
            // rebate a bola invertendo o sinal do eixo Y
            this._reverseY()
        }
    },
    _reverseX: function() {
        this.directionX *= -1
    },
    _reverseY: function() {
        this.directionY *= -1
    },
    _speedUp: function() {
        if (this.speed < 21) {
            this.speed++
        }
    },
    _pointUp: function() {
        this._speedUp()
        this.x = field.w / 2
        this.y = field.h / 2
    },
    _move: function() {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function() {
        canvasCtx.fillStyle = "#FF8C00"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r(), 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()
    },
}

function setup() {
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h
}

function draw() {
    field.draw()
    line.draw()

    leftPaddle.draw()
    rightPaddle.draw()

    score.updateScore()
    score.endGame()

    ball.draw()
}

window.animateFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()

canvasEl.addEventListener("mousemove", function(e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
})