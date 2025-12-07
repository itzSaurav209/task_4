// ✅ Template Card Click Effect
document.querySelectorAll('.template-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        alert(`You selected Portfolio Template ${index + 1}`);
    });
});

// ✅ Create Bubbles in the Background
const bubbleContainer = document.querySelector('.bubble-container');

function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    // Random horizontal position
    bubble.style.left = `${Math.random() * 100}%`;

    // Random size between 10px and 40px
    const size = Math.random() * 30 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Add to container
    bubbleContainer.appendChild(bubble);

    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, 8000);
}

// Create a new bubble every 400ms
setInterval(createBubble, 400);