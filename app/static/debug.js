document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/headers')
        .then(response => response.json())
        .then(headers => {
            const headersBody = document.getElementById('headers-body');
            for (const [key, value] of Object.entries(headers)) {
                const row = document.createElement('tr');
                
                const headerCell = document.createElement('td');
                headerCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900';
                headerCell.textContent = key;
                
                const valueCell = document.createElement('td');
                valueCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                valueCell.textContent = value;
                
                row.appendChild(headerCell);
                row.appendChild(valueCell);
                
                headersBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching headers:', error);
            const headersBody = document.getElementById('headers-body');
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2;
            cell.className = 'px-6 py-4 whitespace-nowrap text-sm text-red-500';
            cell.textContent = 'Error loading headers.';
            row.appendChild(cell);
            headersBody.appendChild(row);
        });
});
