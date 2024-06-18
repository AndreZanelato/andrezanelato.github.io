function createRaindrop() {
    const rainsContainer = document.querySelector('.rain-container');
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    raindrop.style.left = `${Math.random() * 100}vw`;
    raindrop.style.animationDuration = '${Math.random() * 0.5 + 0.5}s';
    rainsContainer.appendChild(raindrop);
    
    setTimeout(() => {
        raindrop.remove();
    }, 2000);
}

setInterval(createRaindrop, 100);