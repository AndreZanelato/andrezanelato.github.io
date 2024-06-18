function createRaindrop() {
    const rainContainer = document.querySelector('.rain-container');
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    raindrop.style.left = `${Math.random() * 100}vw`;
    raindrop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
    rainContainer.appendChild(raindrop);

    setTimeout(() => {
        raindrop.remove();
    }, 2000);
}

setInterval(createRaindrop, 100);