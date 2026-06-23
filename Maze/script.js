body {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    font-family: "Arial", sans-serif;
    min-height: 100vh;
    margin: 0;
    overflow: hidden;
}

#maze-container {
    position: relative;
    margin: 20px;
    box-shadow: 0 0 30px rgba(76, 175, 0, 0.3);
    border-radius: 10px;
    overflow: hidden;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%,
    100%{
        transform: translateY(0);
    }
    50%{
        transform: translateY(-10px);
    }
}

.cell{
    position: relative;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.9);
    transition: background 0.3s ease;
}

.cell.exit {
    background: linear-gradient(45deg, #ff6666, #ff9999);
}

@keyframes exitGlow {
    0%, 
    100%{
        opacity: 0.8;
    }
    50%{
        opacity: 1;
    }
}

.wall{
    background-color: #333;
    position: absolute;
}

.wall.top{
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
}

.wall.right{
    top: 0;
    bottom: 0;
    right: 0;
    width: 2px;
}

.wall.bottom{
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
}

.wall.left{
    top: 0;
    left: 0;
    bottom: 0;
    width: 2px;
}

#player{
    position: absolute;
    background: radial-gradient(circle, #4caf50, #4ca049);
    transition: all 0.2s ease;
    border-radius: 20px;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%,
    100%{
        transform: scale(1);
    }
    50%{
        transform: scale(1.1);
    }
}

#controls {
    margin: 10px;
    display: grid;
    grid-template-areas:
        ". up ."
        "left . right"
        ". down .";
    gap: 10px;
    justify-content: center;
}

.control-btn{
    width: 60px;
    height: 60px;
    font-size: 24px;
    background: linear-gradient(45deg, #333, #444);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.control-btn:hover{
    background: linear-gradient(5deg, #4caf50, #4ca049);
    transform: scale(1.15);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.control-btn:active{
    transform: scale(0.9);
}

#up{
    grid-area: up;
}

#left{
    grid-area: left;
}

#right{
    grid-area: right;
}

#down{
    grid-area: down;
}

#message{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    background: rgba(0, 0, 0, 0.95);
    color: white;
    padding: 30px 40px;
    border-radius: 20px;
    text-align: center;
    display: none;
    opacity: 0;
    animation: messageAppear 0.5s forwards;
    box-shadow: 0 0 30px rgba(76, 175, 0, 0.3);
    border: 2px solid #4caf50;

}

@keyframes messageAppear{
    from{
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to{
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

#try-again{
    background: linear-gradient(45deg, #4caf50, #4ca049);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
    font-size: 16px;
    letter-spacing: 1px;
}

#try-again:hover{
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

#timer{
    font-size: 28px;
    margin: 20px;
    color: #fff;
    text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
    padding: 10px 20px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.3);
    border:2px solid  #4caf50;
}

.exit{
    background-color: #ffcccc;
}

#maze{
    display: grid;
    background-color: white;
}

.hover-effect{
    background: linear-gradient(45deg, #4caf50, #4ca049)    !important;
    transform: scale(1.15) !important;
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

#difficulty {
    font-size: 20px;
    margin: 10px;
    color: #4caf50;
    text-shadow: 0 0 10px rgba(76, 175, 0, 0.5);
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid #4caf50;
    min-width: 150px;
    text-align: center;
}

#wins {
    font-size: 18px;
    margin: 10px;
    color: #ffeb3b;
    text-shadow: 0 0 8px rgba(255, 235, 59, 0.5);
    padding: 6px 14px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid #ffeb3b;
    min-width: 100px;
    text-align: center;
}
