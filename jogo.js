const sprites = new Image();
sprites.src = '../sprites.png';

const somDe_Hit = new Audio();
somDe_Hit.src = '../efeitos/hit.wav';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');



//Plano de fundo
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 300, //controlará a altura da paisagem (prédios e árvores)
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + 100), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
    
}

//chão
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 244,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura

        );
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura - 40), chao.y,
            chao.largura, chao.altura

        );
    }
}

function fazColisão(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY){
        return true;
    }
    return false;
    
}
function criaFlappyBird() {
    //flappyBird (o personagem)
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,

        //velocidade e gravidade que operação sobre o pássaro.
        gravidade: 0.25,
        velocidade: 0,
        pula(){
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza() {
            if(fazColisão(flappyBird, chao)) {
                
                console.log('Fez colisão');
                somDe_Hit.play();
                mudaParaTela(Telas.INICIO);
                return;
            }
            
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;        
            flappyBird.y =  flappyBird.y + flappyBird.velocidade;
        },

        desenha() {
            contexto.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.spriteY, //Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, //Tamannho do recorte da imagem
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        },

    }    
    return flappyBird;
}

const mensagemGetReady = {
    sX: 134,
    sY:0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,

    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    },
}


const globais = {};
/*
    Provê a possibilidade de trocas de telas. Cria uma variável e uma função, que por meio de um parametro
    (novaTela), modifica a tela principal (tela principal é a tela mostrada na tela em determinado momento).
*/ 
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
}

//Cria as cada tela com suas propriedade inerentes e respectivas funções (desenha e atualiza).
const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
        },
        desenha() {
            planoDeFundo.desenha();
            chao.desenha();
            globais.flappyBird.desenha();
            
            mensagemGetReady.desenha();
            
        },
        click() {
            mudaParaTela(Telas.JOGO);


        },
        atualiza() {

        }
    },
    JOGO: {
        desenha() {
            planoDeFundo.desenha();
            chao.desenha();
            globais.flappyBird.desenha();
        },
        click(){
            globais.flappyBird.pula();
        },
        atualiza() {
            globais.flappyBird.atualiza();
        }
    }
}


function loop() {
   
    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop)
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop();