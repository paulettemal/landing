

const databaseURL = 'https://malcolmlanding-default-rtdb.firebaseio.com/'

let sendData = () =>{  
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(`${databaseURL}/votes.json`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response =>{
        if(!response.ok){
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result =>{
        alert('¡Gracias por votar!');
        form.reset();
        getData();
    })
    .catch(error =>{
        alert('Hubo un problema con tu voto. Por favor, inténtalo de nuevo.');
    });
};
let getData = async () =>{  
    try {
        const response = await fetch(`${databaseURL}/votes.json`,{
            method: 'GET'
        });

        if(!response.ok){
            throw new Error('Error al recuperar los datos');
        }

        const data = await response.json();
        if(data){
            const voteCounts = {};
            for (let key in data) {
                const { favoriteCharacter } = data[key];
                if (voteCounts[favoriteCharacter]) {
                    voteCounts[favoriteCharacter]++;
                } else {
                    voteCounts[favoriteCharacter] = 1;
                }
            }
            const voteTable = document.getElementById('voteTable');
            voteTable.innerHTML = '';
            let index = 1;
            for(let character in voteCounts){
                voteTable.innerHTML += `
                    <tr>
                        <th>${index}</th>
                        <td>${character}</td>
                        <td>${voteCounts[character]}</td>
                    </tr>`;
                index++;
            }
        }
    }catch(error){
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos. Inténtalo más tarde.');
    }
};

let ready = () =>{ 
    console.log('DOM está listo')

    // Recuperación de datos
    getData();
}
let loaded = (eventLoaded) =>{
    const myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) =>{
        eventSubmit.preventDefault(); 
        sendData();
    });
    getData();
};

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)