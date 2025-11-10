document.addEventListener('DOMContentLoaded', () => {
    const buttonContainer = document.getElementById('button-container');

    fetch('/api/buttons')
        .then(response => response.json())
        .then(buttons => {
            buttons.forEach(button => {
                const buttonElement = document.createElement('button');
                buttonElement.id = button.entity_id;
                buttonElement.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2';
                
                const iconElement = document.createElement('i');
                iconElement.className = `mdi ${button.icon} text-2xl`;
                
                const spanElement = document.createElement('span');
                spanElement.textContent = button.name;
                
                buttonElement.appendChild(iconElement);
                buttonElement.appendChild(spanElement);
                
                buttonElement.addEventListener('click', () => unlock(button.entity_id));
                
                buttonContainer.appendChild(buttonElement);
            });
        });
});

function unlock(entityId) {
    const button = document.getElementById(entityId);
    button.disabled = true;
    button.classList.remove('bg-blue-500', 'hover:bg-blue-700');
    button.classList.add('bg-gray-400');

    fetch(`/api/unlock/${entityId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // In a real application, you would include an authentication token here
            // 'X-API-KEY': 'user-token' 
        }
    })
    .then(response => {
        if (response.ok) {
            button.classList.remove('bg-gray-400');
            button.classList.add('bg-green-500');
            setTimeout(() => {
                button.disabled = false;
                button.classList.remove('bg-green-500');
                button.classList.add('bg-blue-500', 'hover:bg-blue-700');
            }, 2000);
        } else {
            button.classList.remove('bg-gray-400');
            button.classList.add('bg-red-500');
            setTimeout(() => {
                button.disabled = false;
                button.classList.remove('bg-red-500');
                button.classList.add('bg-blue-500', 'hover:bg-blue-700');
            }, 2000);
        }
    })
    .catch(() => {
        button.classList.remove('bg-gray-400');
        button.classList.add('bg-red-500');
        setTimeout(() => {
            button.disabled = false;
            button.classList.remove('bg-red-500');
            button.classList.add('bg-blue-500', 'hover:bg-blue-700');
        }, 2000);
    });
}