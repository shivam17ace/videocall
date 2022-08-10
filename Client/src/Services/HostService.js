export async function handleCreate(id, roomPassword, email){
    try{
        let data = {id, roomPassword, email};
        const url = "http://localhost:8000/createroom";
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
            }
        })
        return await response.json();
    }
    catch(error){
        return [];
    }
}