const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function checkAuth()
{
    try
    {
        const res = await fetch(`${BACKEND_URL}api/users/me`,
        {
            credentials: "include"
        });
        if(!res.ok)
        {
            return null;
        }

        const data = await res.json();
        return data;
    }catch(err)
    {
        return false;
    }
    
}

