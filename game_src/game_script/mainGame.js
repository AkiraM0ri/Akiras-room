// setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// tamanho da janela do canvas
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// mostra a tecla pressionada
const p = document.createElement('h1')
p.innerHTML = `pressione uma tecla`
document.body.appendChild(p)

// caixa de dialogo
const dialogBox = document.createElement('div')

// efeitos sonoros
const catSfx = new Audio()
catSfx.src =  './assets/audio/meow.mp3'
const soundTrack= new Audio()
soundTrack.volume = 0.2
soundTrack.src =  './assets/audio/map.wav'

// sprite do jogador
const playerSpriteDown = new Image()
playerSpriteDown.src = './assets/imgs/playerDown.png'
const playerSpriteUp = new Image()
playerSpriteUp.src = './assets/imgs/playerUp.png'
const playerSpriteLeft = new Image()
playerSpriteLeft.src = './assets/imgs/playerLeft.png'
const playerSpriteRight = new Image()
playerSpriteRight.src = './assets/imgs/playerRight.png'

// sprite do gato
const myCat = new Image()
myCat.src = './assets/imgs/cat.png'

// classe construtora dos sprites
class Sprite{
    constructor({ position, velocity, image, frames = { max: 1 }, sprites}) {
        this.position = position,
        this.image = image,
        this.frames = {...frames, val: 0, elapsed: 0}
        this.sprites = sprites
        
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
    }
    // limpa o cenario para os proximos sprites
    update(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // funcao de desenhar 
    draw() {
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        )
        // verifica se o usuario esta se mexendo para animar ou nao
        if(!this.moving) {
            this.frames.val = 0
            return
        }
        
        // verifica a quantidade de frames para o personagem trocar de sprite e dar ilusao de animacao
        if(this.frames.max > 1) this.frames.elapsed++
        
        if(this.frames.elapsed % 10 === 0){
            if(this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

const cat = new Sprite({
    position: {
        x: 1400,
        y: 300
    },
    image: myCat,
    frames:  {
        max: 1
    },
})

// instancia do jogador
const player = new Sprite({
    position: {
        x: canvas.width /2 - 192 / 4 / 2,
        y: canvas.height /2 - 68 / 2,
    },
    image: playerSpriteDown,
    frames:  {
        max: 4
    },
    sprites: {
        up: playerSpriteUp,
        down: playerSpriteDown,
        left: playerSpriteLeft,
        right: playerSpriteRight
    }
})

const catText = document.createElement('h1')
catText.innerHTML = `o gato diz: Joguem o jogo do Akira :3`
dialogBox.appendChild(catText)

// teclas de movimentacao
let lastKey = ''
const userKeys = {
    "w": {
        pressed: false,
    },
    "a": {
        pressed: false,
    },
    "s": {
        pressed: false,
    },
    "d": {
        pressed: false,
    },
    "f": {
        interact: false
    }
}

// verifica se o usuario clicou ou nao em uma tecla para se movimentar
window.addEventListener('keydown', (e) => {
    if(userKeys[e.key]) userKeys[e.key].pressed = true, lastKey = e.key
})
window.addEventListener('keyup', (e) => {
    if(userKeys[e.key]) userKeys[e.key].pressed = false
    if(userKeys[e.key].interact) document.body.appendChild(dialogBox) , catSfx.play()
})

// colisao
const colision = ({obj1, obj2}) => {
    return (
        obj1.position.x + obj1.width >= obj2.position.x &&
        obj1.position.x <= obj2.position.x + obj2.width &&
        obj1.position.y <= obj2.position.y + obj2.height &&
        obj1.position.y + obj1.height >=  obj2.position.y
    )
}

// verifica qual tecla foi pressionada
const vrfyMov = () => {
// verifica qual tecla foi pressionada para executar a movimentacao
if(userKeys.w.pressed && lastKey === 'w'){
    player.moving = true
    player.image = player.sprites.up
    p.innerHTML = "w pressionado"
    player.position.y -= 3
}
else if (userKeys.a.pressed && lastKey === 'a'){
    player.moving = true
    player.image = player.sprites.left
    p.innerHTML = "a pressionado"
    player.position.x -= 3
}
else if (userKeys.s.pressed && lastKey === 's'){
    player.moving = true
    player.image = player.sprites.down
    p.innerHTML = "s pressionado"
    player.position.y += 3
}
else if (userKeys.d.pressed && lastKey === 'd'){
    player.moving = true
    player.image = player.sprites.right
    p.innerHTML = "d pressionado"
    player.position.x += 3
}
else{
    p.innerHTML = "pressione uma tecla"
    player.moving = false
}
}

// gameLoop 
function gameLoop() {
    // recursividade
    window.requestAnimationFrame(gameLoop)
    player.update()
    cat.draw()
    player.draw()
    vrfyMov()

    if(colision({ obj1: player, obj2: cat })){
        userKeys.f.interact = true
    } else {
        userKeys.f.interact = false
        dialogBox.remove()
    }
}

soundTrack.play()
gameLoop()